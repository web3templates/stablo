'use strict';

module.exports = middleware => {
  const applyMiddleware = function applyMiddleware(hook, defaultValue) {
    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    const bailEarly = hook === 'onError';

    let value = defaultValue;
    for (let i = 0; i < middleware[hook].length; i++) {
      const handler = middleware[hook][i];
      value = handler.apply(undefined, [value].concat(args));

      if (bailEarly && !value) {
        break;
      }
    }

    return value;
  };

  return applyMiddleware;
};
//# sourceMappingURL=middlewareReducer.js.map