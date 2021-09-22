'use strict';

const objectAssign = require('object-assign');
const defaultShouldRetry = require('../util/node-shouldRetry');

const isStream = stream => stream !== null && typeof stream === 'object' && typeof stream.pipe === 'function';

const retry = function retry() {
  let opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  const maxRetries = opts.maxRetries || 5;
  const retryDelay = opts.retryDelay || getRetryDelay;
  const allowRetry = opts.shouldRetry || defaultShouldRetry;

  return {
    onError: (err, context) => {
      const options = context.options;
      const max = options.maxRetries || maxRetries;
      const shouldRetry = options.shouldRetry || allowRetry;
      const attemptNumber = options.attemptNumber || 0;

      // We can't retry if body is a stream, since it'll be drained
      if (isStream(options.body)) {
        return err;
      }

      // Give up?
      if (!shouldRetry(err, attemptNumber, options) || attemptNumber >= max) {
        return err;
      }

      // Create a new context with an increased attempt number, so we can exit if we reach a limit
      const newContext = objectAssign({}, context, {
        options: objectAssign({}, options, { attemptNumber: attemptNumber + 1 })
      });

      // Wait a given amount of time before doing the request again
      setTimeout(() => context.channels.request.publish(newContext), retryDelay(attemptNumber));

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