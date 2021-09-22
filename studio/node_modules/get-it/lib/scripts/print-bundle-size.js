'use strict';

/* eslint-disable no-console */
var fs = require('fs');
var path = require('path');
var boxen = require('boxen');
var chalk = require('chalk');
var gzipSize = require('gzip-size');
var prettyBytes = require('pretty-bytes');

var read = function read(filePath) {
  return new Promise(function (resolve, reject) {
    fs.readFile(filePath, function (err, content) {
      if (err) {
        reject(err);
      } else {
        resolve(content);
      }
    });
  });
};

var zip = function zip(content) {
  return new Promise(function (resolve, reject) {
    gzipSize(content, function (err, zipSize) {
      if (err) {
        reject(err);
      } else {
        resolve({
          uncompressed: content.length,
          compressed: zipSize
        });
      }
    });
  });
};

var umdPath = path.join(__dirname, '..', '..', 'umd');
var bundlePath = path.join(umdPath, 'get-it.js');
var minPath = path.join(umdPath, 'get-it.min.js');
var allPath = path.join(umdPath, 'get-it-all.js');
var minAllPath = path.join(umdPath, 'get-it-all.min.js');

Promise.all([bundlePath, minPath, allPath, minAllPath].map(read)).then(function (files) {
  return Promise.all(files.map(zip));
}).then(output).catch(throwOnError);

function output(res) {
  var text = ['UMD bundle size:', '────────────────', 'Raw: ' + size(res[0].uncompressed), 'Raw + gzip: ' + size(res[0].compressed), '', 'Minified: ' + size(res[1].uncompressed), 'Minified + gzip: ' + size(res[1].compressed), '', 'Full bundle: ' + size(res[2].uncompressed), 'Full bundle + gzip: ' + size(res[2].compressed), '', 'Full bundle, minified: ' + size(res[3].uncompressed), 'Full bundle, minified + gzip: ' + size(res[3].compressed)].join('\n');

  console.log(boxen(text, {
    padding: 1,
    borderColor: 'yellow',
    align: 'right'
  }));
}

function throwOnError(err) {
  if (err && err.code === 'ENOENT') {
    throw new Error('File not found, did you run `npm run bundle` first?');
  } else if (err) {
    throw err;
  }
}

function size(bytes) {
  var color = bytes > 1024 * 50 ? 'red' : 'green';
  return chalk[color](prettyBytes(bytes));
}
//# sourceMappingURL=print-bundle-size.js.map