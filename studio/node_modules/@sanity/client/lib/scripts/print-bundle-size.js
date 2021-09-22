"use strict";

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _boxen = _interopRequireDefault(require("boxen"));

var _chalk = _interopRequireDefault(require("chalk"));

var _gzipSize = _interopRequireDefault(require("gzip-size"));

var _prettyBytes = _interopRequireDefault(require("pretty-bytes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-console */
var umdPath = _path.default.join(__dirname, '..', '..', 'umd');

var bundlePath = _path.default.join(umdPath, 'sanityClient.js');

var minPath = _path.default.join(umdPath, 'sanityClient.min.js');

_fs.default.readFile(bundlePath, function (bundleErr, bundle) {
  throwOnError(bundleErr);

  _fs.default.readFile(minPath, function (minErr, minBundle) {
    throwOnError(minErr);
    (0, _gzipSize.default)(bundle, function (gzipErr, gzipedSize) {
      throwOnError(gzipErr);
      var output = ['UMD bundle size:', '────────────────', "Minified: ".concat(size(bundle.length)), "Minified + gzip: ".concat(size(gzipedSize))].join('\n');
      console.log((0, _boxen.default)(output, {
        padding: 1,
        borderColor: 'yellow',
        align: 'right'
      }));
    });
  });
});

function throwOnError(err) {
  if (err && err.code === 'ENOENT') {
    throw new Error('File not found, did you run `npm run build` first?');
  } else if (err) {
    throw err;
  }
}

function size(bytes) {
  var color = bytes > 1024 * 50 ? 'red' : 'green';
  return _chalk.default[color]((0, _prettyBytes.default)(bytes));
}