"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _descend = _interopRequireDefault(require("./descend"));

var _toPath = _interopRequireDefault(require("./toPath"));

var _parse = _interopRequireDefault(require("./parse"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Expression {
  constructor(expr) {
    _defineProperty(this, "expr", void 0);

    // This is a wrapped expr
    if (expr.expr) {
      this.expr = expr.expr;
    } else {
      this.expr = expr;
    }

    if (!this.expr.type) {
      throw new Error('Attempt to create Expression for expression with no type');
    }
  }

  isPath() {
    return this.expr.type == 'path';
  }

  isUnion() {
    return this.expr.type == 'union';
  }

  isCollection() {
    return this.isPath() || this.isUnion();
  }

  isConstraint() {
    return this.expr.type == 'constraint';
  }

  isRecursive() {
    return this.expr.type == 'recursive';
  }

  isExistenceConstraint() {
    return this.isConstraint() && this.expr.operator == '?';
  }

  isIndex() {
    return this.expr.type == 'index';
  }

  isRange() {
    return this.expr.type == 'range';
  }

  expandRange(probe) {
    var start = this.expr.start || 0;
    start = interpretNegativeIndex(start, probe);
    var end = this.expr.end || probe.length();
    end = interpretNegativeIndex(end, probe);
    var step = this.expr.step || 1;
    return {
      start,
      end,
      step
    };
  }

  isAttributeReference() {
    return this.expr.type == 'attribute';
  } // Is a range or index -> something referencing indexes


  isIndexReference() {
    return this.isIndex() || this.isRange();
  }

  name() {
    return this.expr.name;
  }

  isSelfReference() {
    return this.expr.type == 'alias' && this.expr.target == 'self';
  }

  constraintTargetIsSelf() {
    return this.isConstraint() && this.expr.lhs.type == 'alias' && this.expr.lhs.target == 'self';
  }

  constraintTargetIsAttribute() {
    return this.isConstraint() && this.expr.lhs.type == 'attribute';
  }

  testConstraint(probe) {
    if (this.constraintTargetIsSelf()) {
      if (probe.containerType() != 'primitive') {
        return false;
      }

      if (this.isExistenceConstraint()) {
        return true;
      }

      var _lhs = probe.get();

      var _rhs = this.expr.rhs.value;
      return testBinaryOperator(_lhs, this.expr.operator, _rhs);
    }

    if (!this.constraintTargetIsAttribute()) {
      throw new Error("Constraint target ".concat(this.expr.lhs.type, " not supported"));
    }

    if (probe.containerType() != 'object') {
      return false;
    }

    var lhs = probe.getAttribute(this.expr.lhs.name);

    if (lhs === undefined || lhs === null || lhs.containerType() != 'primitive') {
      // LHS is void and empty, or it is a collection
      return false;
    }

    if (this.isExistenceConstraint()) {
      // There is no rhs, and if we're here the key did exist
      return true;
    }

    var rhs = this.expr.rhs.value;
    return testBinaryOperator(lhs.get(), this.expr.operator, rhs);
  }

  pathNodes() {
    if (this.isPath()) {
      return this.expr.nodes;
    }

    return [this.expr];
  }

  prepend(node) {
    if (!node) {
      return this;
    }

    return new Expression({
      type: 'path',
      nodes: node.pathNodes().concat(this.pathNodes())
    });
  }

  concat(other) {
    if (!other) {
      return this;
    }

    return other.prepend(this);
  }

  descend() {
    return (0, _descend.default)(this.expr).map(headTail => {
      var _headTail = _slicedToArray(headTail, 2),
          head = _headTail[0],
          tail = _headTail[1];

      return {
        head: head ? new Expression(head) : null,
        tail: tail ? new Expression(tail) : null
      };
    });
  }

  unwrapRecursive() {
    if (!this.isRecursive()) {
      throw new Error("Attempt to unwrap recursive on type ".concat(this.expr.type));
    }

    return new Expression(this.expr.term);
  }

  toIndicies(probe) {
    if (!this.isIndexReference()) {
      throw new Error('Node cannot be converted to indexes');
    }

    if (this.expr.type == 'index') {
      return [interpretNegativeIndex(this.expr.value, probe)];
    } else if (this.expr.type == 'range') {
      var result = [];

      var _this$expandRange = this.expandRange(probe),
          start = _this$expandRange.start,
          end = _this$expandRange.end,
          step = _this$expandRange.step;

      if (step < 0) {
        ;
        var _ref = [end, start];
        start = _ref[0];
        end = _ref[1];
      }

      for (var i = start; i < end; i++) {
        result.push(i);
      }

      return result;
    }

    throw new Error("Unable to convert ".concat(this.expr.type, " to indices"));
  }

  toFieldReferences() {
    if (this.isIndexReference()) {
      return this.toIndicies();
    }

    if (this.isAttributeReference()) {
      return [this.name()];
    }

    throw new Error("Can't convert ".concat(this.expr.type, " to field references"));
  }

  toString() {
    return (0, _toPath.default)(this.expr);
  }

  static fromPath(path) {
    return new Expression((0, _parse.default)(path));
  }

  static attributeReference(name) {
    return new Expression({
      type: 'attribute',
      name: name
    });
  }

  static indexReference(i) {
    return new Expression({
      type: 'index',
      value: i
    });
  }

} // Tests an operator on two given primitive values


exports.default = Expression;

function testBinaryOperator(lhsValue, operator, rhsValue) {
  switch (operator) {
    case '>':
      return lhsValue > rhsValue;

    case '>=':
      return lhsValue >= rhsValue;

    case '<':
      return lhsValue < rhsValue;

    case '<=':
      return lhsValue <= rhsValue;

    case '==':
      return lhsValue === rhsValue;

    case '!=':
      return lhsValue != rhsValue;

    default:
      throw new Error("Unsupported binary operator ".concat(operator));
  }
}

function interpretNegativeIndex(index, probe) {
  if (index < 0) {
    return index + probe.length();
  }

  return index;
}