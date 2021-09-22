"use strict";

var _require = require('@rexxars/p-ratelimit'),
    pRateLimit = _require.pRateLimit;

var assign = require('object-assign');

module.exports = function rateLimit() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (!options.rate || options.rate < 1) {
    throw new Error("'rate' options must be passed to rateLimit middleware, and must be > 0");
  }

  var limit = pRateLimit(options);

  function onReturn(channels) {
    if (!channels.request || !channels.response) {
      throw new Error('Rate limit middleware must be called before promise/observable middlewares');
    }

    var publish = function publish(ctx) {
      return limit(function () {
        return new Promise(function (resolve, reject) {
          channels.error.subscribe(reject);
          channels.response.subscribe(resolve);
          channels.request.publish(ctx);
        });
      }).catch(function (err) {
        if (err.name === 'RateLimitTimeoutError') {
          err.message = options.maxDelayError || 'Rate limit max delay reached';
        }

        channels.error.publish(err);
      });
    };

    var request = {
      publish: publish,
      subscribe: channels.request.publish
    };
    return assign({}, channels, {
      request: request
    });
  }

  return {
    onReturn: onReturn
  };
};
//# sourceMappingURL=rateLimit.js.map