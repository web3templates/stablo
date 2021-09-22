'use strict'

var isPlainObject = require('lodash.isplainobject')

function isPromise(obj) {
  return typeof obj === 'object' && typeof obj.then === 'function'
}

function promisePropsRecursive(obj) {
  var awaitables = []
  var keys = Object.keys(obj)
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i]
    var value = obj[key]

    if (Array.isArray(value)) {
      value = Promise.all(value)
    } else if (isPlainObject(value)) {
      value = promisePropsRecursive(value)
    }
    awaitables.push(value)
  }

  return Promise.all(awaitables).then(function assembleResults(results) {
    var byName = {}
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i]
      byName[key] = results[i]
    }
    return byName
  });
}

module.exports = promisePropsRecursive
