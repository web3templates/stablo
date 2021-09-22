"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _max2 = _interopRequireDefault(require("lodash/max"));

var _min2 = _interopRequireDefault(require("lodash/min"));

var _util = require("./util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class InsertPatch {
  constructor(id, location, path, items) {
    _defineProperty(this, "location", void 0);

    _defineProperty(this, "path", void 0);

    _defineProperty(this, "items", void 0);

    _defineProperty(this, "id", void 0);

    this.id = id;
    this.location = location;
    this.path = path;
    this.items = items;
  }

  apply(targets, accessor) {
    var result = accessor;

    if (accessor.containerType() !== 'array') {
      throw new Error('Attempt to apply insert patch to non-array value');
    }

    switch (this.location) {
      case 'before':
        {
          var pos = minIndex(targets, accessor);
          result = result.insertItemsAt(pos, this.items);
          break;
        }

      case 'after':
        {
          var _pos = maxIndex(targets, accessor);

          result = result.insertItemsAt(_pos + 1, this.items);
          break;
        }

      case 'replace':
        {
          // TODO: Properly implement ranges in compliance with Gradient
          // This will only properly support single contiguous ranges
          var indicies = (0, _util.targetsToIndicies)(targets, accessor);
          result = result.unsetIndices(indicies);
          result = result.insertItemsAt(indicies[0], this.items);
          break;
        }

      default:
        {
          throw new Error("Unsupported location atm: ".concat(this.location));
        }
    }

    return result;
  }

}

exports.default = InsertPatch;

function minIndex(targets, accessor) {
  var result = (0, _min2.default)((0, _util.targetsToIndicies)(targets, accessor)); // Ranges may be zero-length and not turn up in indices

  targets.forEach(target => {
    if (target.isRange()) {
      var _target$expandRange = target.expandRange(),
          start = _target$expandRange.start;

      if (start < result) {
        result = start;
      }
    }
  });
  return result;
}

function maxIndex(targets, accessor) {
  var result = (0, _max2.default)((0, _util.targetsToIndicies)(targets, accessor)); // Ranges may be zero-length and not turn up in indices

  targets.forEach(target => {
    if (target.isRange()) {
      var _target$expandRange2 = target.expandRange(),
          end = _target$expandRange2.end;

      if (end > result) {
        result = end;
      }
    }
  });
  return result;
}