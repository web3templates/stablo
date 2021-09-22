"use strict";

module.exports = function (params) {
  var qs = [];

  for (var key in params) {
    if (params.hasOwnProperty(key)) {
      qs.push("".concat(encodeURIComponent(key), "=").concat(encodeURIComponent(params[key])));
    }
  }

  return qs.length > 0 ? "?".concat(qs.join('&')) : '';
};