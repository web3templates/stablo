"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = toPath;

// Converts a parsed expression back into jsonpath2, roughly - mostly for use
// with tests.
function toPath(expr) {
  return toPathInner(expr, false);
}

function toPathInner(expr, inUnion) {
  switch (expr.type) {
    case 'attribute':
      return expr.name;

    case 'alias':
      return expr.target === 'self' ? '@' : '$';

    case 'number':
      return "".concat(expr.value);

    case 'range':
      {
        var result = [];

        if (!inUnion) {
          result.push('[');
        }

        if (expr.start) {
          result.push("".concat(expr.start));
        }

        result.push(':');

        if (expr.end) {
          result.push("".concat(expr.end));
        }

        if (expr.step) {
          result.push(":".concat(expr.step));
        }

        if (!inUnion) {
          result.push(']');
        }

        return result.join('');
      }

    case 'index':
      if (inUnion) {
        return "".concat(expr.value);
      }

      return "[".concat(expr.value, "]");

    case 'constraint':
      var inner = "".concat(toPathInner(expr.lhs, false), " ").concat(expr.operator, " ").concat(toPathInner(expr.rhs, false));

      if (inUnion) {
        return inner;
      }

      return "[".concat(inner, "]");

    case 'string':
      return JSON.stringify(expr.value);

    case 'path':
      {
        var _result = [];
        var nodes = expr.nodes.slice();

        while (nodes.length > 0) {
          var node = nodes.shift();

          _result.push(toPath(node));

          var upcoming = nodes[0];

          if (upcoming && toPathInner(upcoming, false)[0] !== '[') {
            _result.push('.');
          }
        }

        return _result.join('');
      }

    case 'union':
      var terms = expr.nodes.map(e => toPathInner(e, true));
      return "[".concat(terms.join(','), "]");

    default:
      throw new Error("Unknown node type ".concat(expr.type));

    case 'recursive':
      return "..".concat(toPathInner(expr.term, false));
  }
}