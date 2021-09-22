'use strict';

const objectAssign = require('object-assign');

module.exports = function (headers) {
  let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return {
    processOptions: options => {
      const existing = options.headers || {};
      options.headers = opts.override ? objectAssign({}, existing, headers) : objectAssign({}, headers, existing);

      return options;
    }
  };
};
//# sourceMappingURL=headers.js.map