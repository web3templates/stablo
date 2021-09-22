'use strict';

function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return `Cancel${this.message ? `: ${this.message}` : ''}`;
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;
//# sourceMappingURL=Cancel.js.map