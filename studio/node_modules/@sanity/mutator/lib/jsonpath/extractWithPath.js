"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = extractWithPath;

var _extractAccessors = _interopRequireDefault(require("./extractAccessors"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function extractWithPath(path, value) {
  var accessors = (0, _extractAccessors.default)(path, value);
  return accessors.map(acc => ({
    path: acc.path,
    value: acc.get()
  }));
}