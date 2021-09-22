[![Build Status](https://travis-ci.org/kaelzhang/p-async-cache.svg?branch=master)](https://travis-ci.org/kaelzhang/p-async-cache)
<!-- optional appveyor tst
[![Windows Build Status](https://ci.appveyor.com/api/projects/status/github/kaelzhang/p-async-cache?branch=master&svg=true)](https://ci.appveyor.com/project/kaelzhang/p-async-cache)
-->
<!-- optional npm version
[![NPM version](https://badge.fury.io/js/p-async-cache.svg)](http://badge.fury.io/js/p-async-cache)
-->
<!-- optional npm downloads
[![npm module downloads per month](http://img.shields.io/npm/dm/p-async-cache.svg)](https://www.npmjs.org/package/p-async-cache)
-->
<!-- optional dependency status
[![Dependency Status](https://david-dm.org/kaelzhang/p-async-cache.svg)](https://david-dm.org/kaelzhang/p-async-cache)
-->

# p-async-cache

Cache the promise lookups and avoid fetching the same thing more than necessary.

## Install

```sh
$ npm install p-async-cache --save
```

## Usage

```js
import PAC from 'p-async-cache'

let counter = 0
const cache = new PAC({
  async load (userId) {
    counter ++
    return await getUserFromRemote(userId)
  }
})

function get () {
  cache.get(123).then(({value}) => {
    console.log(value, counter)
  })
}

get()
get()

// [object User] 1
// [object User] 1 (The counter still be 1)
```

## new AC(options)

- **options** `Object=`
  - stale `Boolean` whether allow stale value
  - stringify `function()=JSON.stringify` method to serialize the `params` to a cache key.
  - load `AsyncFunction(...params)|function(...params):Promise|function(...params)` accepts a normal synchronous function, a function that returns a promise, or an async function, and the `params` will be the parameters of the `.get(...params)` method.
  - other options that [lru-cache](https://www.npmjs.com/package/lru-cache) supports

### Example for `options.stale`

```js
import delay from 'delay'

const cache = new AC({
  stale: true,
  maxAge: 100,
  load (a, b) {
    return delay(1).then(() => a + b)
  }
})

cache.get(1, 2)
.then(({value, stale}) => {
  console.log(value)      // 3
  console.log(stale)      // false

  // Delay a timespan which is bigger than `maxAge`
  return delay(101).then(() => cache.get(1, 2))
})
.then(({value, stale}) => {
  console.log(value)      // 3
  console.log(stale)      // true (the value is stale)

  return delay(10).then(() => cache.get(1, 2))
})
.then(({value, stale}) => {
  console.log(value)      // 3
  console.log(stale)      // false (if the value is found as stale, it will refresh the value in the background)
})
```

## .get(...params)

- **params** `any` that will be passed into `options.load(...params)`

Returns `Promise`

Lookup the value in the cache,

- if found, then return.
- if not found,
  - if allow stale values, and the value is stale, then return the value, and refresh value in background.
  - otherwise, load the value with `load(...params)`

## Other methods of `lru-cache`

- `.reset()`
- `.has(...params)`
- `.peek(...params)`
- `.del(...params)`

## License

MIT
