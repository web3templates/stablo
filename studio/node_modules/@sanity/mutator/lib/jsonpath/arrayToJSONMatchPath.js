"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = arrayToJSONMatchPath;
// Converts an array of simple values (strings, numbers only) to a jsonmatch path string.
var IS_DOTTABLE = /^[a-z_$]+/;

function stringifySegment(segment, hasLeading) {
  var type = typeof segment;
  var isNumber = type === 'number';

  if (isNumber) {
    return "[".concat(segment, "]");
  }

  var isObject = type === 'object' && segment !== null && segment !== undefined;

  if (isObject) {
    return Object.keys(segment).map(key => {
      var val = segment[key];
      return "[".concat(key, "==\"").concat(val, "\"]");
    }).join('');
  }

  if (IS_DOTTABLE.test(segment)) {
    return hasLeading ? segment : ".".concat(segment);
  }

  return "['".concat(segment, "']");
}

function arrayToJSONMatchPath(pathArray) {
  return pathArray.reduce((acc, segment, index) => {
    return acc + stringifySegment(segment, index === 0);
  }, '');
}