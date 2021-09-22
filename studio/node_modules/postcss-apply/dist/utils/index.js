'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = kebabify;
function kebabify(prop) {
  var upperToHyphen = function upperToHyphen(match, offset, string) {
    var addDash = offset && string.charAt(offset - 1) !== '-';

    return (addDash ? '-' : '') + match.toLowerCase();
  };

  return prop.replace(/[A-Z]/g, upperToHyphen);
}