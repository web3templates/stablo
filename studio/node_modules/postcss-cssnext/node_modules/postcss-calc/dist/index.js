'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _postcss = require('postcss');

var _transform = require('./lib/transform');

var _transform2 = _interopRequireDefault(_transform);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _postcss.plugin)('postcss-calc', function (opts) {
  var options = Object.assign({
    precision: 5,
    preserve: false,
    warnWhenCannotResolve: false,
    mediaQueries: false,
    selectors: false
  }, opts);

  return function (css, result) {
    css.walk(function (node) {
      var type = node.type;

      if (type === 'decl') (0, _transform2.default)(node, "value", options, result);
      if (type === 'atrule' && options.mediaQueries) (0, _transform2.default)(node, "params", options, result);
      if (type === 'rule' && options.selectors) (0, _transform2.default)(node, "selector", options, result);
    });
  };
});
module.exports = exports['default'];