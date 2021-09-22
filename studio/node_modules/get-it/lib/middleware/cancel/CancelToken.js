'use strict';

var Cancel = require('./Cancel');

function CancelToken(executor) {
  var _this = this;

  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise = null;
  this.promise = new Promise(function (resolve) {
    resolvePromise = resolve;
  });

  executor(function (message) {
    if (_this.reason) {
      // Cancellation has already been requested
      return;
    }

    _this.reason = new Cancel(message);
    resolvePromise(_this.reason);
  });
}

CancelToken.source = function () {
  var cancel = void 0;
  var token = new CancelToken(function (can) {
    cancel = can;
  });

  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;
//# sourceMappingURL=CancelToken.js.map