'use strict';

var createErrorClass = require('create-error-class');

var HttpError = createErrorClass('HttpError', function (res, ctx) {
  var truncatedUrl = res.url.length > 400 ? res.url.slice(0, 399) + '\u2026' : res.url;
  var msg = res.method + '-request to ' + truncatedUrl + ' resulted in ';
  msg += 'HTTP ' + res.statusCode + ' ' + res.statusMessage;

  this.message = msg.trim();
  this.response = res;
  this.request = ctx.options;
});

module.exports = function () {
  return {
    onResponse: function onResponse(res, ctx) {
      var isHttpError = res.statusCode >= 400;
      if (!isHttpError) {
        return res;
      }

      throw new HttpError(res, ctx);
    }
  };
};
//# sourceMappingURL=httpErrors.js.map