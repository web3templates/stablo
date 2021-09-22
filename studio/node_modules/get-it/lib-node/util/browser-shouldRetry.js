'use strict';

module.exports = (err, attempt, options) => {
  if (options.method !== 'GET' && options.method !== 'HEAD') {
    return false;
  }

  return err.isNetworkError || false;
};
//# sourceMappingURL=browser-shouldRetry.js.map