"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parse;

var _SetPatch = _interopRequireDefault(require("./SetPatch"));

var _IncPatch = _interopRequireDefault(require("./IncPatch"));

var _InsertPatch = _interopRequireDefault(require("./InsertPatch"));

var _SetIfMissingPatch = _interopRequireDefault(require("./SetIfMissingPatch"));

var _UnsetPatch = _interopRequireDefault(require("./UnsetPatch"));

var _DiffMatchPatch = _interopRequireDefault(require("./DiffMatchPatch"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Parses a Gradient patch into our own personal patch implementations
function parse(patch) {
  var result = [];

  if (Array.isArray(patch)) {
    return patch.reduce((r, p) => r.concat(parse(p)), result);
  }

  if (patch.set) {
    Object.keys(patch.set).forEach(path => {
      result.push(new _SetPatch.default(patch.id, path, patch.set[path]));
    });
  }

  if (patch.setIfMissing) {
    Object.keys(patch.setIfMissing).forEach(path => {
      result.push(new _SetIfMissingPatch.default(patch.id, path, patch.setIfMissing[path]));
    });
  } // TODO: merge


  if (patch.unset) {
    patch.unset.forEach(path => {
      result.push(new _UnsetPatch.default(patch.id, path));
    });
  }

  if (patch.diffMatchPatch) {
    Object.keys(patch.diffMatchPatch).forEach(path => {
      result.push(new _DiffMatchPatch.default(patch.id, path, patch.diffMatchPatch[path]));
    });
  }

  if (patch.inc) {
    Object.keys(patch.inc).forEach(path => {
      result.push(new _IncPatch.default(patch.id, path, patch.inc[path]));
    });
  }

  if (patch.dec) {
    Object.keys(patch.dec).forEach(path => {
      result.push(new _IncPatch.default(patch.id, path, -patch.dec[path]));
    });
  }

  if (patch.insert) {
    var location;
    var path;
    var spec = patch.insert;

    if (spec.before) {
      location = 'before';
      path = spec.before;
    } else if (spec.after) {
      location = 'after';
      path = spec.after;
    } else if (spec.replace) {
      location = 'replace';
      path = spec.replace;
    }

    result.push(new _InsertPatch.default(patch.id, location, path, spec.items));
  }

  return result;
}