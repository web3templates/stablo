'use strict';

const objectAssign = require('object-assign');

module.exports = function () {
  let opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (typeof opts.inject !== 'function') {
    throw new Error('`injectResponse` middleware requires a `inject` function');
  }

  function inject(prevValue, event) {
    const response = opts.inject(event, prevValue);
    if (!response) {
      return prevValue;
    }

    // Merge defaults so we don't have to provide the most basic of details unless we want to
    const options = event.context.options;
    return objectAssign({}, {
      body: '',
      url: options.url,
      method: options.method,
      headers: {},
      statusCode: 200,
      statusMessage: 'OK'
    }, response);
  }

  return { interceptRequest: inject };
};
//# sourceMappingURL=injectResponse.js.map