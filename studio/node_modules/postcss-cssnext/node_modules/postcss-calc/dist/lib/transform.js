'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _postcssSelectorParser = require('postcss-selector-parser');

var _postcssSelectorParser2 = _interopRequireDefault(_postcssSelectorParser);

var _reduceCssCalc = require('reduce-css-calc');

var _reduceCssCalc2 = _interopRequireDefault(_reduceCssCalc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MATCH_CALC = /((?:\-[a-z]+\-)?calc)/;

function transformValue(value, options, result, item) {
  if (!value) {
    return value;
  }

  var reduced = (0, _reduceCssCalc2.default)(value, options.precision);
  // if the warnWhenCannotResolve option is on, inform the user that the calc
  // expression could not be resolved to a single value
  if (options.warnWhenCannotResolve && MATCH_CALC.test(reduced)) {
    result.warn("Could not reduce expression: " + value, { plugin: 'postcss-calc', node: item });
  }

  return reduced;
}

function transformSelector(value, options, result, item) {
  return (0, _postcssSelectorParser2.default)(function (selectors) {
    selectors.walk(function (node) {
      // attribute value
      // e.g. the "calc(3*3)" part of "div[data-size="calc(3*3)"]"
      if (node.type === 'attribute') {
        var val = transformValue(node.raws.unquoted, options, result, item);
        node.value = node.quoted ? '"' + val + '"' : val;
      }

      // tag value
      // e.g. the "calc(3*3)" part of "div:nth-child(2n + calc(3*3))"
      if (node.type === 'tag') node.value = transformValue(node.value, options, result, item);

      return;
    });
  }).process(value).result.toString();
}

exports.default = function (node, property, options, result) {
  var value = property === "selector" ? transformSelector(node[property], options, result, node) : transformValue(node[property], options, result, node);

  // if the preserve option is enabled and the value has changed, write the
  // transformed value into a cloned node which is inserted before the current
  // node, preserving the original value. Otherwise, overwrite the original
  // value.
  if (options.preserve && node[property] !== value) {
    var clone = node.clone();
    clone[property] = value;
    node.parent.insertBefore(node, clone);
  } else node[property] = value;
};

module.exports = exports['default'];