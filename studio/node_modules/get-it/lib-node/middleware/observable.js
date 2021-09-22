'use strict';

const global = require('../util/global');
const objectAssign = require('object-assign');

module.exports = function () {
  let opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  const Observable = opts.implementation || global.Observable;
  if (!Observable) {
    throw new Error('`Observable` is not available in global scope, and no implementation was passed');
  }

  return {
    onReturn: (channels, context) => new Observable(observer => {
      channels.error.subscribe(err => observer.error(err));
      channels.progress.subscribe(event => observer.next(objectAssign({ type: 'progress' }, event)));
      channels.response.subscribe(response => {
        observer.next(objectAssign({ type: 'response' }, response));
        observer.complete();
      });

      channels.request.publish(context);
      return () => channels.abort.publish();
    })
  };
};
//# sourceMappingURL=observable.js.map