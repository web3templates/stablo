"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  name: 'check',
  signature: '',
  description: '[deprecated]',
  hideFromHelp: true,
  action: (args, context) => {
    const {
      output
    } = context;
    output.print('`sanity check` is deprecated and no longer has any effect');
  }
};
exports.default = _default;