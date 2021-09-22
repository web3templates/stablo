
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./asset-utils.cjs.production.min.js')
} else {
  module.exports = require('./asset-utils.cjs.development.js')
}
