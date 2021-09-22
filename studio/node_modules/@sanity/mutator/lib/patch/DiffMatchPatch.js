"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var DMP = _interopRequireWildcard(require("diff-match-patch"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var dmp = new DMP.diff_match_patch();

function applyPatch(patch, oldValue) {
  // Silently avoid patching if the value type is not string
  if (typeof oldValue !== 'string') return oldValue;
  return dmp.patch_apply(patch, oldValue)[0];
}

class DiffMatchPatch {
  constructor(id, path, dmpPatchSrc) {
    _defineProperty(this, "path", void 0);

    _defineProperty(this, "dmpPatch", void 0);

    _defineProperty(this, "id", void 0);

    this.id = id;
    this.path = path;
    this.dmpPatch = dmp.patch_fromText(dmpPatchSrc);
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
            var oldValue = result.getIndex(i).get();
            var nextValue = applyPatch(this.dmpPatch, oldValue);
            result = result.setIndex(i, nextValue);
          }
        });
      } else if (target.isAttributeReference() && result.hasAttribute(target.name())) {
        var oldValue = result.getAttribute(target.name()).get();
        var nextValue = applyPatch(this.dmpPatch, oldValue);
        result = result.setAttribute(target.name(), nextValue);
      } else {
        throw new Error("Unable to apply diffMatchPatch to target ".concat(target.toString()));
      }
    });
    return result;
  }

}

exports.default = DiffMatchPatch;