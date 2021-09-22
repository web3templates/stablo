'use strict';

var objectAssign = require('object-assign');

module.exports = function (headers) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return {
    processOptions: function processOptions(options) {
      var existing = options.headers || {};
      options.headers = opts.override ? objectAssign({}, existing, headers) : objectAssign({}, headers, existing);

      return options;
    }
  };
};
//# sourceMappingURL=headers.js.map