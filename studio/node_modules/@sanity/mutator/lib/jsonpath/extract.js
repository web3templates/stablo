"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = extract;

var _extractAccessors = _interopRequireDefault(require("./extractAccessors"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function extract(path, value) {
  var accessors = (0, _extractAccessors.default)(path, value);
  return accessors.map(acc => acc.get());
}