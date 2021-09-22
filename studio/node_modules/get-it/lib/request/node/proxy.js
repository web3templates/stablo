'use strict';

/**
 * Code borrowed from https://github.com/request/request
 * Apache License 2.0
 */

/* eslint-disable no-process-env */
var url = require('url');
var objectAssign = require('object-assign');

function formatHostname(hostname) {
  // canonicalize the hostname, so that 'oogle.com' won't match 'google.com'
  return hostname.replace(/^\.*/, '.').toLowerCase();
}

function parseNoProxyZone(zoneStr) {
  var zone = zoneStr.trim().toLowerCase();

  var zoneParts = zone.split(':', 2);
  var zoneHost = formatHostname(zoneParts[0]);
  var zonePort = zoneParts[1];
  var hasPort = zone.indexOf(':') > -1;

  return { hostname: zoneHost, port: zonePort, hasPort: hasPort };
}

function uriInNoProxy(uri, noProxy) {
  var port = uri.port || (uri.protocol === 'https:' ? '443' : '80');
  var hostname = formatHostname(uri.hostname);
  var noProxyList = noProxy.split(',');

  // iterate through the noProxyList until it finds a match.
  return noProxyList.map(parseNoProxyZone).some(function (noProxyZone) {
    var isMatchedAt = hostname.indexOf(noProxyZone.hostname);
    var hostnameMatched = isMatchedAt > -1 && isMatchedAt === hostname.length - noProxyZone.hostname.length;

    if (noProxyZone.hasPort) {
      return port === noProxyZone.port && hostnameMatched;
    }

    return hostnameMatched;
  });
}

function getProxyFromUri(uri) {
  // Decide the proper request proxy to use based on the request URI object and the
  // environmental variables (NO_PROXY, HTTP_PROXY, etc.)
  // respect NO_PROXY environment variables (see: http://lynx.isc.org/current/breakout/lynx_help/keystrokes/environments.html)
  var noProxy = process.env.NO_PROXY || process.env.no_proxy || '';

  // if the noProxy is a wildcard then return null
  if (noProxy === '*') {
    return null;
  }

  // if the noProxy is not empty and the uri is found return null
  if (noProxy !== '' && uriInNoProxy(uri, noProxy)) {
    return null;
  }

  // Check for HTTP or HTTPS Proxy in environment, else default to null
  if (uri.protocol === 'http:') {
    return process.env.HTTP_PROXY || process.env.http_proxy || null;
  }

  if (uri.protocol === 'https:') {
    return process.env.HTTPS_PROXY || process.env.https_proxy || process.env.HTTP_PROXY || process.env.http_proxy || null;
  }

  // if none of that works, return null
  // (What uri protocol are you using then?)
  return null;
}

function getHostFromUri(uri) {
  var host = uri.host;

  // Drop :port suffix from Host header if known protocol.
  if (uri.port) {
    if (uri.port === '80' && uri.protocol === 'http:' || uri.port === '443' && uri.protocol === 'https:') {
      host = uri.hostname;
    }
  }

  return host;
}

function getHostHeaderWithPort(uri) {
  var port = uri.port || (uri.protocol === 'https:' ? '443' : '80');
  return uri.hostname + ':' + port;
}

function rewriteUriForProxy(reqOpts, uri, proxy) {
  var headers = reqOpts.headers || {};
  var options = objectAssign({}, reqOpts, { headers: headers });
  headers.host = headers.host || getHostHeaderWithPort(uri);
  options.protocol = proxy.protocol || options.protocol;
  options.hostname = proxy.host.replace(/:\d+/, '');
  options.port = proxy.port;
  options.host = getHostFromUri(objectAssign({}, uri, proxy));
  options.href = options.protocol + '//' + options.host + options.path;
  options.path = url.format(uri);
  return options;
}

function getProxyOptions(options) {
  var proxy = void 0;
  if (options.hasOwnProperty('proxy')) {
    proxy = options.proxy;
  } else {
    var uri = url.parse(options.url);
    proxy = getProxyFromUri(uri);
  }

  return typeof proxy === 'string' ? url.parse(proxy) : proxy;
}

exports.rewriteUriForProxy = rewriteUriForProxy;
exports.getProxyOptions = getProxyOptions;
//# sourceMappingURL=proxy.js.map