"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function performIncrement(previousValue, delta) {
  if (!Number.isFinite(previousValue)) return previousValue;
  return previousValue + delta;
}

class IncPatch {
  constructor(id, path, value) {
    _defineProperty(this, "path", void 0);

    _defineProperty(this, "value", void 0);

    _defineProperty(this, "id", void 0);

    this.path = path;
    this.value = value;
    this.id = id;
  }

  apply(targets, accessor) {
    var result = accessor; // The target must be a container type

    if (result.containerType() == 'primitive') {
      return result;
    }

    targets.forEach(target => {
      if (target.isIndexReference()) {
        target.toIndicies(accessor).forEach(i => {
          // Skip patching unless the index actually currently exists
          if (result.getIndex(i)) {
            var previousValue = result.getIndex(i).get();
            result = result.setIndex(i, performIncrement(previousValue, this.value));
          }
        });
      } else if (target.isAttributeReference() && result.hasAttribute(target.name())) {
        var previousValue = result.getAttribute(target.name()).get();
        result = result.setAttribute(target.name(), performIncrement(previousValue, this.value));
      } else {
        throw new Error("Unable to apply to target ".concat(target.toString()));
      }
    });
    return result;
  }

}

exports.default = IncPatch;