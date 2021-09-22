'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/* eslint-disable no-process-env */
const qs = require('querystring');
const url = require('url');
const http = require('http');
const https = require('https');
const concat = require('simple-concat');
const follow = require('follow-redirects');
const timedOut = require('@sanity/timed-out');
const isStream = require('is-stream');
const toStream = require('into-stream');
const objectAssign = require('object-assign');
const progressStream = require('progress-stream');
const decompressResponse = require('decompress-response');

var _require = require('./node/proxy');

const getProxyOptions = _require.getProxyOptions,
      rewriteUriForProxy = _require.rewriteUriForProxy;

const tunneling = require('./node/tunnel');

const adapter = 'node';

// Reduce a fully fledged node-style response object to
// something that works in both browser and node environment
const reduceResponse = (res, reqUrl, method, body) => ({
  body,
  url: reqUrl,
  method: method,
  headers: res.headers,
  statusCode: res.statusCode,
  statusMessage: res.statusMessage
});

module.exports = (context, cb) => {
  const options = context.options;
  const uri = objectAssign({}, url.parse(options.url));
  const bodyType = isStream(options.body) ? 'stream' : typeof options.body;

  if (bodyType !== 'undefined' && bodyType !== 'stream' && bodyType !== 'string' && !Buffer.isBuffer(options.body)) {
    throw new Error(`Request body must be a string, buffer or stream, got ${bodyType}`);
  }

  const lengthHeader = {};
  if (options.bodySize) {
    lengthHeader['content-length'] = options.bodySize;
  } else if (options.body && bodyType !== 'stream') {
    lengthHeader['content-length'] = Buffer.byteLength(options.body);
  }

  // Make sure callback is not called in the event of a cancellation
  let aborted = false;
  const callback = (err, res) => !aborted && cb(err, res);
  context.channels.abort.subscribe(() => {
    aborted = true;
  });

  // Create a reduced subset of options meant for the http.request() method
  let reqOpts = objectAssign({}, uri, {
    method: options.method,
    headers: objectAssign({}, lowerCaseHeaders(options.headers), lengthHeader),
    maxRedirects: options.maxRedirects
  });

  // Figure out proxying/tunnel options
  const proxy = getProxyOptions(options);
  const tunnel = proxy && tunneling.shouldEnable(options);

  // Allow middleware to inject a response, for instance in the case of caching or mocking
  const injectedResponse = context.applyMiddleware('interceptRequest', undefined, {
    adapter,
    context
  });

  // If middleware injected a response, treat it as we normally would and return it
  // Do note that the injected response has to be reduced to a cross-environment friendly response
  if (injectedResponse) {
    const cbTimer = setImmediate(callback, null, injectedResponse);
    const abort = () => clearImmediate(cbTimer);
    return { abort };
  }

  // We're using the follow-redirects module to transparently follow redirects
  if (options.maxRedirects !== 0) {
    reqOpts.maxRedirects = options.maxRedirects || 5;
  }

  // Apply currect options for proxy tunneling, if enabled
  if (proxy && tunnel) {
    reqOpts = tunneling.applyAgent(reqOpts, proxy);
  } else if (proxy && !tunnel) {
    reqOpts = rewriteUriForProxy(reqOpts, uri, proxy);
  }

  // Handle proxy authorization if present
  if (!tunnel && proxy && proxy.auth && !reqOpts.headers['proxy-authorization']) {
    var _ref = proxy.auth.username ? [proxy.auth.username, proxy.auth.password] : proxy.auth.split(':').map(item => qs.unescape(item)),
        _ref2 = _slicedToArray(_ref, 2);

    const username = _ref2[0],
          password = _ref2[1];


    const auth = Buffer.from(`${username}:${password}`, 'utf8');
    const authBase64 = auth.toString('base64');
    reqOpts.headers['proxy-authorization'] = `Basic ${authBase64}`;
  }

  // Figure out transport (http/https, forwarding/non-forwarding agent)
  const transport = getRequestTransport(reqOpts, proxy, tunnel);
  if (typeof options.debug === 'function' && proxy) {
    options.debug('Proxying using %s', reqOpts.agent ? 'tunnel agent' : `${reqOpts.host}:${reqOpts.port}`);
  }

  const finalOptions = context.applyMiddleware('finalizeOptions', reqOpts);
  const request = transport.request(finalOptions, response => {
    // See if we should try to decompress the response
    const tryDecompress = reqOpts.method !== 'HEAD';
    const res = tryDecompress ? decompressResponse(response) : response;

    const resStream = context.applyMiddleware('onHeaders', res, {
      headers: response.headers,
      adapter,
      context
    });

    // Concatenate the response body, then parse the response with middlewares
    concat(resStream, (err, data) => {
      if (err) {
        return callback(err);
      }

      const body = options.rawBody ? data : data.toString();
      const reduced = reduceResponse(res, response.responseUrl || options.url, // On redirects, `responseUrl` is set
      reqOpts.method, body);

      return callback(null, reduced);
    });
  });

  if (options.timeout) {
    timedOut(request, options.timeout);
  }

  request.once('error', callback);

  // Cheating a bit here; since we're not concerned about the "bundle size" in node,
  // and modifying the body stream would be sorta tricky, we're just always going
  // to put a progress stream in the middle here. Note that

  var _getProgressStream = getProgressStream(options);

  const bodyStream = _getProgressStream.bodyStream,
        progress = _getProgressStream.progress;

  // Let middleware know we're about to do a request

  context.applyMiddleware('onRequest', { options, adapter, request, context, progress });

  if (bodyStream) {
    bodyStream.pipe(request);
  } else {
    request.end(options.body);
  }

  return { abort: () => request.abort() };
};

function getProgressStream(options) {
  if (!options.body) {
    return {};
  }

  const bodyIsStream = isStream(options.body);
  const length = options.bodySize || (bodyIsStream ? null : Buffer.byteLength(options.body));
  if (!length) {
    return bodyIsStream ? { bodyStream: options.body } : {};
  }

  const progress = progressStream({ time: 16, length });
  const bodyStream = bodyIsStream ? options.body : toStream(options.body);
  return { bodyStream: bodyStream.pipe(progress), progress };
}

function getRequestTransport(reqOpts, proxy, tunnel) {
  const isHttpsRequest = reqOpts.protocol === 'https:';
  const transports = reqOpts.maxRedirects === 0 ? { http: http, https: https } : { http: follow.http, https: follow.https };

  if (!proxy || tunnel) {
    return isHttpsRequest ? transports.https : transports.http;
  }

  // Assume the proxy is an HTTPS proxy if port is 443, or if there is a
  // `protocol` option set that starts with https
  let isHttpsProxy = proxy.port === 443;
  if (proxy.protocol) {
    isHttpsProxy = /^https:?/.test(proxy.protocol);
  }

  return isHttpsProxy ? transports.https : transports.http;
}

function lowerCaseHeaders(headers) {
  return Object.keys(headers || {}).reduce((acc, header) => {
    acc[header.toLowerCase()] = headers[header];
    return acc;
  }, {});
}
//# sourceMappingURL=node-request.js.map