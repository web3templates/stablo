'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _postcss = require('postcss');

var _visitor = require('./visitor');

var _visitor2 = _interopRequireDefault(_visitor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _postcss.plugin)('postcss-apply', function (options) {
  return function (css, result) {
    var visitor = new _visitor2.default(options);
    visitor.result = result;

    visitor.prepend();

    css.walkRules(visitor.collect);

    visitor.resolveNested();

    css.walkAtRules('apply', visitor.resolve);
  };
});