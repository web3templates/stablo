'use strict';

var global = require('../util/global');
var objectAssign = require('object-assign');

module.exports = function () {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var Observable = opts.implementation || global.Observable;
  if (!Observable) {
    throw new Error('`Observable` is not available in global scope, and no implementation was passed');
  }

  return {
    onReturn: function onReturn(channels, context) {
      return new Observable(function (observer) {
        channels.error.subscribe(function (err) {
          return observer.error(err);
        });
        channels.progress.subscribe(function (event) {
          return observer.next(objectAssign({ type: 'progress' }, event));
        });
        channels.response.subscribe(function (response) {
          observer.next(objectAssign({ type: 'response' }, response));
          observer.complete();
        });

        channels.request.publish(context);
        return function () {
          return channels.abort.publish();
        };
      });
    }
  };
};
//# sourceMappingURL=observable.js.map