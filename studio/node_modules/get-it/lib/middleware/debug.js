'use strict';

var debugIt = require('debug');

var SENSITIVE_HEADERS = ['Cookie', 'Authorization'];

var hasOwn = Object.prototype.hasOwnProperty;
var redactKeys = function redactKeys(source, keys) {
  var target = {};
  for (var key in source) {
    if (hasOwn.call(source, key)) {
      target[key] = keys.indexOf(key) > -1 ? '<redacted>' : source[key];
    }
  }
  return target;
};

module.exports = function () {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var verbose = opts.verbose;
  var namespace = opts.namespace || 'get-it';
  var defaultLogger = debugIt(namespace);
  var log = opts.log || defaultLogger;
  var shortCircuit = log === defaultLogger && !debugIt.enabled(namespace);
  var requestId = 0;

  return {
    processOptions: function processOptions(options) {
      options.debug = log;
      options.requestId = options.requestId || ++requestId;
      return options;
    },

    onRequest: function onRequest(event) {
      // Short-circuit if not enabled, to save some CPU cycles with formatting stuff
      if (shortCircuit || !event) {
        return event;
      }

      var options = event.options;

      log('[%s] HTTP %s %s', options.requestId, options.method, options.url);

      if (verbose && options.body && typeof options.body === 'string') {
        log('[%s] Request body: %s', options.requestId, options.body);
      }

      if (verbose && options.headers) {
        var headers = opts.redactSensitiveHeaders === false ? options.headers : redactKeys(options.headers, SENSITIVE_HEADERS);

        log('[%s] Request headers: %s', options.requestId, JSON.stringify(headers, null, 2));
      }

      return event;
    },

    onResponse: function onResponse(res, context) {
      // Short-circuit if not enabled, to save some CPU cycles with formatting stuff
      if (shortCircuit || !res) {
        return res;
      }

      var reqId = context.options.requestId;

      log('[%s] Response code: %s %s', reqId, res.statusCode, res.statusMessage);

      if (verbose && res.body) {
        log('[%s] Response body: %s', reqId, stringifyBody(res));
      }

      return res;
    },

    onError: function onError(err, context) {
      var reqId = context.options.requestId;
      if (!err) {
        log('[%s] Error encountered, but handled by an earlier middleware', reqId);
        return err;
      }

      log('[%s] ERROR: %s', reqId, err.message);
      return err;
    }
  };
};

function stringifyBody(res) {
  var contentType = (res.headers['content-type'] || '').toLowerCase();
  var isJson = contentType.indexOf('application/json') !== -1;
  return isJson ? tryFormat(res.body) : res.body;
}

// Attempt pretty-formatting JSON
function tryFormat(body) {
  try {
    var parsed = typeof body === 'string' ? JSON.parse(body) : body;
    return JSON.stringify(parsed, null, 2);
  } catch (err) {
    return body;
  }
}
//# sourceMappingURL=debug.js.map