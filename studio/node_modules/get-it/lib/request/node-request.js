'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/* eslint-disable no-process-env */
var qs = require('querystring');
var url = require('url');
var http = require('http');
var https = require('https');
var concat = require('simple-concat');
var follow = require('follow-redirects');
var timedOut = require('@sanity/timed-out');
var isStream = require('is-stream');
var toStream = require('into-stream');
var objectAssign = require('object-assign');
var progressStream = require('progress-stream');
var decompressResponse = require('decompress-response');

var _require = require('./node/proxy'),
    getProxyOptions = _require.getProxyOptions,
    rewriteUriForProxy = _require.rewriteUriForProxy;

var tunneling = require('./node/tunnel');

var adapter = 'node';

// Reduce a fully fledged node-style response object to
// something that works in both browser and node environment
var reduceResponse = function reduceResponse(res, reqUrl, method, body) {
  return {
    body: body,
    url: reqUrl,
    method: method,
    headers: res.headers,
    statusCode: res.statusCode,
    statusMessage: res.statusMessage
  };
};

module.exports = function (context, cb) {
  var options = context.options;
  var uri = objectAssign({}, url.parse(options.url));
  var bodyType = isStream(options.body) ? 'stream' : _typeof(options.body);

  if (bodyType !== 'undefined' && bodyType !== 'stream' && bodyType !== 'string' && !Buffer.isBuffer(options.body)) {
    throw new Error('Request body must be a string, buffer or stream, got ' + bodyType);
  }

  var lengthHeader = {};
  if (options.bodySize) {
    lengthHeader['content-length'] = options.bodySize;
  } else if (options.body && bodyType !== 'stream') {
    lengthHeader['content-length'] = Buffer.byteLength(options.body);
  }

  // Make sure callback is not called in the event of a cancellation
  var aborted = false;
  var callback = function callback(err, res) {
    return !aborted && cb(err, res);
  };
  context.channels.abort.subscribe(function () {
    aborted = true;
  });

  // Create a reduced subset of options meant for the http.request() method
  var reqOpts = objectAssign({}, uri, {
    method: options.method,
    headers: objectAssign({}, lowerCaseHeaders(options.headers), lengthHeader),
    maxRedirects: options.maxRedirects
  });

  // Figure out proxying/tunnel options
  var proxy = getProxyOptions(options);
  var tunnel = proxy && tunneling.shouldEnable(options);

  // Allow middleware to inject a response, for instance in the case of caching or mocking
  var injectedResponse = context.applyMiddleware('interceptRequest', undefined, {
    adapter: adapter,
    context: context
  });

  // If middleware injected a response, treat it as we normally would and return it
  // Do note that the injected response has to be reduced to a cross-environment friendly response
  if (injectedResponse) {
    var cbTimer = setImmediate(callback, null, injectedResponse);
    var abort = function abort() {
      return clearImmediate(cbTimer);
    };
    return { abort: abort };
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
    var _ref = proxy.auth.username ? [proxy.auth.username, proxy.auth.password] : proxy.auth.split(':').map(function (item) {
      return qs.unescape(item);
    }),
        _ref2 = _slicedToArray(_ref, 2),
        username = _ref2[0],
        password = _ref2[1];

    var auth = Buffer.from(username + ':' + password, 'utf8');
    var authBase64 = auth.toString('base64');
    reqOpts.headers['proxy-authorization'] = 'Basic ' + authBase64;
  }

  // Figure out transport (http/https, forwarding/non-forwarding agent)
  var transport = getRequestTransport(reqOpts, proxy, tunnel);
  if (typeof options.debug === 'function' && proxy) {
    options.debug('Proxying using %s', reqOpts.agent ? 'tunnel agent' : reqOpts.host + ':' + reqOpts.port);
  }

  var finalOptions = context.applyMiddleware('finalizeOptions', reqOpts);
  var request = transport.request(finalOptions, function (response) {
    // See if we should try to decompress the response
    var tryDecompress = reqOpts.method !== 'HEAD';
    var res = tryDecompress ? decompressResponse(response) : response;

    var resStream = context.applyMiddleware('onHeaders', res, {
      headers: response.headers,
      adapter: adapter,
      context: context
    });

    // Concatenate the response body, then parse the response with middlewares
    concat(resStream, function (err, data) {
      if (err) {
        return callback(err);
      }

      var body = options.rawBody ? data : data.toString();
      var reduced = reduceResponse(res, response.responseUrl || options.url, // On redirects, `responseUrl` is set
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

  var _getProgressStream = getProgressStream(options),
      bodyStream = _getProgressStream.bodyStream,
      progress = _getProgressStream.progress;

  // Let middleware know we're about to do a request


  context.applyMiddleware('onRequest', { options: options, adapter: adapter, request: request, context: context, progress: progress });

  if (bodyStream) {
    bodyStream.pipe(request);
  } else {
    request.end(options.body);
  }

  return { abort: function abort() {
      return request.abort();
    } };
};

function getProgressStream(options) {
  if (!options.body) {
    return {};
  }

  var bodyIsStream = isStream(options.body);
  var length = options.bodySize || (bodyIsStream ? null : Buffer.byteLength(options.body));
  if (!length) {
    return bodyIsStream ? { bodyStream: options.body } : {};
  }

  var progress = progressStream({ time: 16, length: length });
  var bodyStream = bodyIsStream ? options.body : toStream(options.body);
  return { bodyStream: bodyStream.pipe(progress), progress: progress };
}

function getRequestTransport(reqOpts, proxy, tunnel) {
  var isHttpsRequest = reqOpts.protocol === 'https:';
  var transports = reqOpts.maxRedirects === 0 ? { http: http, https: https } : { http: follow.http, https: follow.https };

  if (!proxy || tunnel) {
    return isHttpsRequest ? transports.https : transports.http;
  }

  // Assume the proxy is an HTTPS proxy if port is 443, or if there is a
  // `protocol` option set that starts with https
  var isHttpsProxy = proxy.port === 443;
  if (proxy.protocol) {
    isHttpsProxy = /^https:?/.test(proxy.protocol);
  }

  return isHttpsProxy ? transports.https : transports.http;
}

function lowerCaseHeaders(headers) {
  return Object.keys(headers || {}).reduce(function (acc, header) {
    acc[header.toLowerCase()] = headers[header];
    return acc;
  }, {});
}
//# sourceMappingURL=node-request.js.map