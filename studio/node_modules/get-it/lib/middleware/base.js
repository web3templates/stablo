'use strict';

var objectAssign = require('object-assign');

var leadingSlash = /^\//;
var trailingSlash = /\/$/;

module.exports = function (baseUrl) {
  var baseUri = baseUrl.replace(trailingSlash, '');
  return {
    processOptions: function processOptions(options) {
      if (/^https?:\/\//i.test(options.url)) {
        return options; // Already prefixed
      }

      var url = [baseUri, options.url.replace(leadingSlash, '')].join('/');
      return objectAssign({}, options, { url: url });
    }
  };
};
//# sourceMappingURL=base.js.map