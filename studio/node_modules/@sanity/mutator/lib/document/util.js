"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractIdFromPatch = extractIdFromPatch;

// Given any valid Sanity patch, extracts the ID of the document
// being modified - if any
function extractIdFromPatch(patch) {
  var extractInner = attrs => {
    if (typeof attrs != 'object') {
      return null;
    }

    for (var key in attrs) {
      if (key === '_id' || key === 'id') {
        return attrs[key];
      }

      if (key === '_id' || key === 'id') {
        return extractInner(attrs[key]);
      }
    }

    return null;
  };

  return extractInner(patch);
}