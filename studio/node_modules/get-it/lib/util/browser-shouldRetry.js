'use strict';

module.exports = function (err, attempt, options) {
  if (options.method !== 'GET' && options.method !== 'HEAD') {
    return false;
  }

  return err.isNetworkError || false;
};
//# sourceMappingURL=browser-shouldRetry.js.map