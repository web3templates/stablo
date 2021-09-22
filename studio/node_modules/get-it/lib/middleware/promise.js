'use strict';

var global = require('../util/global');
var Cancel = require('./cancel/Cancel');
var CancelToken = require('./cancel/CancelToken');
var isCancel = require('./cancel/isCancel');

var promise = function promise() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var Promise = options.implementation || global.Promise;
  if (!Promise) {
    throw new Error('`Promise` is not available in global scope, and no implementation was passed');
  }

  return {
    onReturn: function onReturn(channels, context) {
      return new Promise(function (resolve, reject) {
        var cancel = context.options.cancelToken;
        if (cancel) {
          cancel.promise.then(function (reason) {
            channels.abort.publish(reason);
            reject(reason);
          });
        }

        channels.error.subscribe(reject);
        channels.response.subscribe(function (response) {
          resolve(options.onlyBody ? response.body : response);
        });

        // Wait until next tick in case cancel has been performed
        setTimeout(function () {
          try {
            channels.request.publish(context);
          } catch (err) {
            reject(err);
          }
        }, 0);
      });
    }
  };
};

promise.Cancel = Cancel;
promise.CancelToken = CancelToken;
promise.isCancel = isCancel;

module.exports = promise;
//# sourceMappingURL=promise.js.map