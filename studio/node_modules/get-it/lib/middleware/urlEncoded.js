'use strict';

var objectAssign = require('object-assign');
var isPlainObject = require('is-plain-object');
var urlEncode = require('form-urlencoded');

var encode = urlEncode.default || urlEncode;

var isBuffer = function isBuffer(obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj);
};

module.exports = function () {
  return {
    processOptions: function processOptions(options) {
      var body = options.body;
      if (!body) {
        return options;
      }

      var isStream = typeof body.pipe === 'function';
      var shouldSerialize = !isStream && !isBuffer(body) && isPlainObject(body);

      if (!shouldSerialize) {
        return options;
      }

      return objectAssign({}, options, {
        body: encode(options.body),
        headers: objectAssign({}, options.headers, {
          'Content-Type': 'application/x-www-form-urlencoded'
        })
      });
    }
  };
};
//# sourceMappingURL=urlEncoded.js.map