node-klaw-sync
==============

[![npm Package](https://img.shields.io/npm/v/klaw-sync.svg?style=flat-square)](https://www.npmjs.com/package/klaw-sync)
[![Build Status](https://travis-ci.org/manidlou/node-klaw-sync.svg?branch=master)](https://travis-ci.org/manidlou/node-klaw-sync)
[![windows Build status](https://ci.appveyor.com/api/projects/status/braios34k6qw4h5p/branch/master?svg=true)](https://ci.appveyor.com/project/manidlou/node-klaw-sync/branch/master)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

`klaw-sync` is a Node.js recursive file system walker, which is the synchronous counterpart of [klaw](https://github.com/jprichardson/node-klaw). It lists all files and directories inside a directory recursively and returns an array of objects that each object has two properties: `path` and `stats`. `path` is the full path of the file or directory and `stats` is an instance of [fs.Stats](https://nodejs.org/api/fs.html#fs_class_fs_stats).

Install
-------

    npm i klaw-sync

Usage
-----

### klawSync(directory[, options])

- `directory` `<String>`
- `options` `<Object>` (optional) _all options are `false` by default_
  - `nodir` `<Boolean>`
    - return only files (ignore directories).
  - `nofile` `<Boolean>`
    - return only directories (ignore files).
  - `depthLimit`: `<Number>`
    - the number of times to recurse before stopping. `-1` for unlimited.
  - `fs`: `<Object>`
    - custom `fs`, useful when mocking `fs` object.
  - `filter` `<Function>`
    - function that gets one argument `fn({path: '', stats: {}})` and returns true to include or false to exclude the item.

- **Return:** `<Array<Object>>` `[{path: '', stats: {}}]`

Examples
--------

```js
const klawSync = require('klaw-sync')

const paths = klawSync('/some/dir')
// paths = [{path: '/some/dir/dir1', stats: {}}, {path: '/some/dir/file1', stats: {}}]
```

_**catch error**_

```js
const klawSync = require('klaw-sync')

let paths
try {
  paths = klawSync('/some/dir')
} catch (er) {
  console.error(er)
}
console.dir(paths)
```

_**files only**_

```js
const klawSync = require('klaw-sync')

const files = klawSync('/some/dir', {nodir: true})
// files = [{path: '/some/dir/file1', stats: {}}, {path: '/some/dir/file2', stats: {}}]
```

_**directories only**_

```js
const klawSync = require('klaw-sync')

const dirs = klawSync('/some/dir', {nofile: true})
// dirs = [{path: '/some/dir/dir1', stats: {}}, {path: '/some/dir/dir2', stats: {}}]
```

_**ignore hidden directories**_


```js
const path = require('path')
const klawSync = require('klaw-sync')

const filterFn = item => {
  const basename = path.basename(item.path)
  return basename === '.' || basename[0] !== '.'
}

const paths = klawSync('/some/dir', { filter: filterFn})
```

_**filter based on stats**_

Again here `noRecurseOnFailedFilter` option is not required since we still want to read all directories even though they don't pass the `filter` function, to see if their contents pass the `filter` function.

```js
const klawSync = require('klaw-sync')

const refTime = new Date(2017, 3, 24).getTime()
const filterFn = item => item.stats.mtime.getTime() > refTime

const paths = klawSync('/some/dir', { filter: filterFn })
```

Run tests
---------

lint: `npm run lint`

unit test: `npm run unit`

lint & unit: `npm test`

benchmark: `npm run benchmark`

Performance compare to other similar modules
-----------------------------------------------

Running some basic [benchmark](https://github.com/bestiejs/benchmark.js) tests on these modules:

- `klaw-sync`
- [walk-sync](https://github.com/joliss/node-walk-sync)
- [glob.sync](https://github.com/isaacs/node-glob#globsyncpattern-options)

It turned out (as of January 25, 2017) for the most cases `klaw-sync` is faster than other modules!

##### results (tested on ubuntu 16.04, Intel(R) Core(TM) i7-2630QM CPU @ 2.00GHz, 8 cpus, 8g ram, node v10.0.0)

```bash
Running benchmark tests..

root dir length: 1110
walk-sync x 151 ops/sec ±2.66% (75 runs sampled)
glob.sync x 20.60 ops/sec ±3.84% (38 runs sampled)
klaw-sync x 182 ops/sec ±2.40% (81 runs sampled)
Fastest is klaw-sync

root dir length: 11110
walk-sync x 15.39 ops/sec ±0.44% (42 runs sampled)
glob.sync x 1.92 ops/sec ±2.74% (9 runs sampled)
klaw-sync x 17.03 ops/sec ±0.62% (45 runs sampled)
Fastest is klaw-sync

root dir length: 111110
walk-sync x 1.24 ops/sec ±6.64% (8 runs sampled)
glob.sync x 0.16 ops/sec ±6.55% (5 runs sampled)
klaw-sync x 1.40 ops/sec ±2.30% (8 runs sampled)
Fastest is klaw-sync
```

Credit
------

Special thanks to:

- [agnivade](https://github.com/agnivade)
- [jprichardson](https://github.com/jprichardson)
- [RyanZim](https://github.com/RyanZim)

for their contribution and support.

License
-------

Licensed under MIT
