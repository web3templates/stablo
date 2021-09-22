"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _flatten2 = _interopRequireDefault(require("lodash/flatten"));

var _Expression = _interopRequireDefault(require("./Expression"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Descender {
  constructor(head, tail) {
    _defineProperty(this, "head", void 0);

    _defineProperty(this, "tail", void 0);

    this.head = head;
    this.tail = tail;
  } // Iterate this descender once processing any constraints that are
  // resolvable on the current value. Returns an array of new descenders
  // that are guaranteed to be without constraints in the head


  iterate(probe) {
    var result = [this];

    if (this.head && this.head.isConstraint()) {
      var anyConstraints = true; // Keep rewriting constraints until there are none left

      while (anyConstraints) {
        result = (0, _flatten2.default)(result.map(descender => {
          return descender.iterateConstraints(probe);
        }));
        anyConstraints = result.some(descender => {
          return descender.head && descender.head.isConstraint();
        });
      }
    }

    return result;
  }

  isRecursive() {
    return this.head && this.head.isRecursive();
  }

  hasArrived() {
    return this.head === null && this.tail === null;
  }

  extractRecursives() {
    if (this.head.isRecursive()) {
      var term = this.head.unwrapRecursive();
      return new Descender(null, term.concat(this.tail)).descend();
    }

    return [];
  }

  iterateConstraints(probe) {
    var head = this.head;

    if (head === null || !head.isConstraint()) {
      // Not a constraint, no rewrite
      return [this];
    }

    var result = [];

    if (probe.containerType() === 'primitive' && head.constraintTargetIsSelf()) {
      if (head.testConstraint(probe)) {
        result.push(...this.descend());
      }

      return result;
    } // The value is an array


    if (probe.containerType() === 'array') {
      var _length = probe.length();

      for (var i = 0; i < _length; i++) {
        // Push new descenders with constraint translated to literal indices
        // where they match
        if (head.testConstraint(probe.getIndex(i))) {
          result.push(new Descender(new _Expression.default({
            type: 'index',
            value: i
          }), this.tail));
        }
      }

      return result;
    } // The value is an object


    if (probe.containerType() == 'object') {
      if (this.head.constraintTargetIsSelf()) {
        // There are no matches for target self ('@') on a plain object
        return [];
      }

      if (this.head.testConstraint(probe)) {
        return this.descend();
      }

      return result;
    }

    return result;
  }

  descend() {
    if (!this.tail) {
      return [new Descender(null, null)];
    }

    return this.tail.descend().map(ht => {
      return new Descender(ht.head, ht.tail);
    });
  }

  toString() {
    var result = ['<'];

    if (this.head) {
      result.push(this.head.toString());
    }

    result.push('|');

    if (this.tail) {
      result.push(this.tail.toString());
    }

    result.push('>');
    return result.join('');
  }

}

exports.default = Descender;