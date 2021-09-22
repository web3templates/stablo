'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var objectAssign = require('object-assign');
var defaultShouldRetry = require('../util/node-shouldRetry');

var isStream = function isStream(stream) {
  return stream !== null && (typeof stream === 'undefined' ? 'undefined' : _typeof(stream)) === 'object' && typeof stream.pipe === 'function';
};

var retry = function retry() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var maxRetries = opts.maxRetries || 5;
  var retryDelay = opts.retryDelay || getRetryDelay;
  var allowRetry = opts.shouldRetry || defaultShouldRetry;

  return {
    onError: function onError(err, context) {
      var options = context.options;
      var max = options.maxRetries || maxRetries;
      var shouldRetry = options.shouldRetry || allowRetry;
      var attemptNumber = options.attemptNumber || 0;

      // We can't retry if body is a stream, since it'll be drained
      if (isStream(options.body)) {
        return err;
      }

      // Give up?
      if (!shouldRetry(err, attemptNumber, options) || attemptNumber >= max) {
        return err;
      }

      // Create a new context with an increased attempt number, so we can exit if we reach a limit
      var newContext = objectAssign({}, context, {
        options: objectAssign({}, options, { attemptNumber: attemptNumber + 1 })
      });

      // Wait a given amount of time before doing the request again
      setTimeout(function () {
        return context.channels.request.publish(newContext);
      }, retryDelay(attemptNumber));

      // Signal that we've handled the error and that it should not propagate further
      return null;
    }
  };
};

retry.shouldRetry = defaultShouldRetry;

module.exports = retry;

function getRetryDelay(attemptNum) {
  return 100 * Math.pow(2, attemptNum) + Math.random() * 100;
}
//# sourceMappingURL=retry.js.map