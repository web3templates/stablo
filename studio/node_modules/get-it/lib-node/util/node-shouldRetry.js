'use strict';

const allowed = require('is-retry-allowed');

module.exports = (err, num, options) => {
  if (options.method !== 'GET' && options.method !== 'HEAD') {
    return false;
  }

  // Don't allow retries if we get any http status code by default
  if (err.response && err.response.statusCode) {
    return false;
  }

  return allowed(err);
};
//# sourceMappingURL=node-shouldRetry.js.map