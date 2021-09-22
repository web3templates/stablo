'use strict';

const objectAssign = require('object-assign');

module.exports = proxy => {
  if (proxy !== false && (!proxy || !proxy.host)) {
    throw new Error('Proxy middleware takes an object of host, port and auth properties');
  }

  return {
    processOptions: options => objectAssign({ proxy }, options)
  };
};
//# sourceMappingURL=proxy.js.map