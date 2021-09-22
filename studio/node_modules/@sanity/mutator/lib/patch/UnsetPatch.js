"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _util = require("./util");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class UnsetPatch {
  constructor(id, path) {
    _defineProperty(this, "id", void 0);

    _defineProperty(this, "path", void 0);

    _defineProperty(this, "value", void 0);

    this.id = id;
    this.path = path;
  }

  apply(targets, accessor) {
    var result = accessor;

    switch (accessor.containerType()) {
      case 'array':
        result = result.unsetIndices((0, _util.targetsToIndicies)(targets, accessor));
        break;

      case 'object':
        targets.forEach(target => {
          result = result.unsetAttribute(target.name());
        });
        break;

      default:
        throw new Error('Target value is neither indexable or an object. This error should potentially just be silently ignored?');
    }

    return result;
  }

}

exports.default = UnsetPatch;