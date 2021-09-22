'use strict';

const Cancel = require('./Cancel');

function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  let resolvePromise = null;
  this.promise = new Promise(resolve => {
    resolvePromise = resolve;
  });

  executor(message => {
    if (this.reason) {
      // Cancellation has already been requested
      return;
    }

    this.reason = new Cancel(message);
    resolvePromise(this.reason);
  });
}

CancelToken.source = function () {
  let cancel;
  const token = new CancelToken(can => {
    cancel = can;
  });

  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;
//# sourceMappingURL=CancelToken.js.map