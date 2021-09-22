"use strict";

const {
  pRateLimit
} = require('@rexxars/p-ratelimit');

const assign = require('object-assign');

module.exports = function rateLimit(options = {}) {
  if (!options.rate || options.rate < 1) {
    throw new Error(`'rate' options must be passed to rateLimit middleware, and must be > 0`);
  }

  const limit = pRateLimit(options);

  function onReturn(channels) {
    if (!channels.request || !channels.response) {
      throw new Error('Rate limit middleware must be called before promise/observable middlewares');
    }

    const publish = ctx => {
      return limit(() => new Promise((resolve, reject) => {
        channels.error.subscribe(reject);
        channels.response.subscribe(resolve);
        channels.request.publish(ctx);
      })).catch(err => {
        if (err.name === 'RateLimitTimeoutError') {
          err.message = options.maxDelayError || 'Rate limit max delay reached';
        }

        channels.error.publish(err);
      });
    };

    const request = {
      publish,
      subscribe: channels.request.publish
    };
    return assign({}, channels, {
      request
    });
  }

  return {
    onReturn
  };
};
//# sourceMappingURL=rateLimit.js.map