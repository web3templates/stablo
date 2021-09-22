'use strict';

var objectAssign = require('object-assign');

module.exports = function (proxy) {
  if (proxy !== false && (!proxy || !proxy.host)) {
    throw new Error('Proxy middleware takes an object of host, port and auth properties');
  }

  return {
    processOptions: function processOptions(options) {
      return objectAssign({ proxy: proxy }, options);
    }
  };
};
//# sourceMappingURL=proxy.js.map