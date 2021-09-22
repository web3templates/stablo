"use strict";

var retry = require('get-it/lib-node/middleware/retry');

var debug = require('get-it/lib-node/middleware/debug');

var headers = require('get-it/lib-node/middleware/headers');

var pkg = require('../../package.json');

var middleware = [debug({
  verbose: true,
  namespace: 'sanity:client'
}), headers({
  'User-Agent': "".concat(pkg.name, " ").concat(pkg.version)
}), retry({
  maxRetries: 3
})];
module.exports = middleware;