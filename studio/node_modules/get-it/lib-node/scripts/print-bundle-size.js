'use strict';

/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const boxen = require('boxen');
const chalk = require('chalk');
const gzipSize = require('gzip-size');
const prettyBytes = require('pretty-bytes');

const read = filePath => new Promise((resolve, reject) => {
  fs.readFile(filePath, (err, content) => {
    if (err) {
      reject(err);
    } else {
      resolve(content);
    }
  });
});

const zip = content => new Promise((resolve, reject) => {
  gzipSize(content, (err, zipSize) => {
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

const umdPath = path.join(__dirname, '..', '..', 'umd');
const bundlePath = path.join(umdPath, 'get-it.js');
const minPath = path.join(umdPath, 'get-it.min.js');
const allPath = path.join(umdPath, 'get-it-all.js');
const minAllPath = path.join(umdPath, 'get-it-all.min.js');

Promise.all([bundlePath, minPath, allPath, minAllPath].map(read)).then(files => Promise.all(files.map(zip))).then(output).catch(throwOnError);

function output(res) {
  const text = ['UMD bundle size:', '────────────────', `Raw: ${size(res[0].uncompressed)}`, `Raw + gzip: ${size(res[0].compressed)}`, '', `Minified: ${size(res[1].uncompressed)}`, `Minified + gzip: ${size(res[1].compressed)}`, '', `Full bundle: ${size(res[2].uncompressed)}`, `Full bundle + gzip: ${size(res[2].compressed)}`, '', `Full bundle, minified: ${size(res[3].uncompressed)}`, `Full bundle, minified + gzip: ${size(res[3].compressed)}`].join('\n');

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
  const color = bytes > 1024 * 50 ? 'red' : 'green';
  return chalk[color](prettyBytes(bytes));
}
//# sourceMappingURL=print-bundle-size.js.map