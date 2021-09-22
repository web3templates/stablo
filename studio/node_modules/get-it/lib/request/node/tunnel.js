'use strict';

/**
 * Code borrowed from https://github.com/request/request
 * Modified to be less request-specific, more functional
 * Apache License 2.0
 */
var url = require('url');
var tunnel = require('tunnel-agent');
var objectAssign = require('object-assign');

var uriParts = ['protocol', 'slashes', 'auth', 'host', 'port', 'hostname', 'hash', 'search', 'query', 'pathname', 'path', 'href'];

var defaultProxyHeaderWhiteList = ['accept', 'accept-charset', 'accept-encoding', 'accept-language', 'accept-ranges', 'cache-control', 'content-encoding', 'content-language', 'content-location', 'content-md5', 'content-range', 'content-type', 'connection', 'date', 'expect', 'max-forwards', 'pragma', 'referer', 'te', 'user-agent', 'via'];

var defaultProxyHeaderExclusiveList = ['proxy-authorization'];

exports.shouldEnable = function (options, tunnelOption) {
  // Tunnel HTTPS by default. Allow the user to override this setting.

  // If user has specified a specific tunnel override...
  if (typeof options.tunnel !== 'undefined') {
    return Boolean(options.tunnel);
  }

  // If the destination is HTTPS, tunnel.
  var uri = url.parse(options.url);
  if (uri.protocol === 'https:') {
    return true;
  }

  // Otherwise, do not use tunnel.
  return false;
};

exports.applyAgent = function () {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var proxy = arguments[1];

  var options = objectAssign({}, opts);

  // Setup proxy header exclusive list and whitelist
  var proxyHeaderWhiteList = defaultProxyHeaderWhiteList.concat(options.proxyHeaderWhiteList || []).map(function (header) {
    return header.toLowerCase();
  });

  var proxyHeaderExclusiveList = defaultProxyHeaderExclusiveList.concat(options.proxyHeaderExclusiveList || []).map(function (header) {
    return header.toLowerCase();
  });

  // Get the headers we should send to the proxy
  var proxyHeaders = getAllowedProxyHeaders(options.headers, proxyHeaderWhiteList);
  proxyHeaders.host = constructProxyHost(options);

  // Reduce headers to the ones not exclusive for the proxy
  options.headers = Object.keys(options.headers || {}).reduce(function (headers, header) {
    var isAllowed = proxyHeaderExclusiveList.indexOf(header.toLowerCase()) === -1;
    if (isAllowed) {
      headers[header] = options.headers[header];
    }

    return headers;
  }, {});

  var tunnelFn = getTunnelFn(options, proxy);
  var tunnelOptions = constructTunnelOptions(options, proxy, proxyHeaders);
  options.agent = tunnelFn(tunnelOptions);

  return options;
};

function getTunnelFn(options, proxy) {
  var uri = getUriParts(options);
  var tunnelFnName = constructTunnelFnName(uri, proxy);
  return tunnel[tunnelFnName];
}

function getUriParts(options) {
  return uriParts.reduce(function (uri, part) {
    uri[part] = options[part];
    return uri;
  }, {});
}

function constructTunnelFnName(uri, proxy) {
  var uriProtocol = uri.protocol === 'https:' ? 'https' : 'http';
  var proxyProtocol = proxy.protocol === 'https:' ? 'Https' : 'Http';
  return [uriProtocol, proxyProtocol].join('Over');
}

function constructProxyHost(uri) {
  var port = uri.port;
  var protocol = uri.protocol;
  var proxyHost = uri.hostname + ':';

  if (port) {
    proxyHost += port;
  } else if (protocol === 'https:') {
    proxyHost += '443';
  } else {
    proxyHost += '80';
  }

  return proxyHost;
}

function getAllowedProxyHeaders(headers, whiteList) {
  return Object.keys(headers).filter(function (header) {
    return whiteList.indexOf(header.toLowerCase()) !== -1;
  }).reduce(function (set, header) {
    set[header] = headers[header];
    return set;
  }, {});
}

function constructTunnelOptions(options, proxy, proxyHeaders) {
  return {
    proxy: {
      host: proxy.hostname,
      port: +proxy.port,
      proxyAuth: proxy.auth,
      headers: proxyHeaders
    },
    headers: options.headers,
    ca: options.ca,
    cert: options.cert,
    key: options.key,
    passphrase: options.passphrase,
    pfx: options.pfx,
    ciphers: options.ciphers,
    rejectUnauthorized: options.rejectUnauthorized,
    secureOptions: options.secureOptions,
    secureProtocol: options.secureProtocol
  };
}
//# sourceMappingURL=tunnel.js.map