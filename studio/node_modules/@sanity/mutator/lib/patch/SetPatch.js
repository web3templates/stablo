"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class SetPatch {
  constructor(id, path, value) {
    _defineProperty(this, "id", void 0);

    _defineProperty(this, "path", void 0);

    _defineProperty(this, "value", void 0);

    this.id = id;
    this.path = path;
    this.value = value;
  }

  apply(targets, accessor) {
    var result = accessor;
    targets.forEach(target => {
      if (target.isSelfReference()) {
        result = result.set(this.value);
      } else if (target.isIndexReference()) {
        target.toIndicies(accessor).forEach(i => {
          result = result.setIndex(i, this.value);
        });
      } else if (target.isAttributeReference()) {
        result = result.setAttribute(target.name(), this.value);
      } else {
        throw new Error("Unable to apply to target ".concat(target.toString()));
      }
    });
    return result;
  }

}

exports.default = SetPatch;