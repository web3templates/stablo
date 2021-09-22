# get-it

[![npm version](http://img.shields.io/npm/v/get-it.svg?style=flat-square)](https://www.npmjs.com/package/get-it)[![Build Status](http://img.shields.io/travis/sanity-io/get-it/main.svg?style=flat-square)](https://travis-ci.org/sanity-io/get-it)

Generic HTTP request library for node.js (>= 8) and browsers (IE9 and newer)

## Motivation

We wanted an HTTP request library that worked transparently in Node.js and browsers with a small browser bundle footprint.

To be able to use the same library in a range of different applications with varying requirements, but still keep the bundle size down, we took inspiration from [http-client](https://github.com/mjackson/http-client) which cleverly composes functionality into the client.

## Features

Using a middleware approach, `get-it` has the following feature set:

- Promise, observable and low-level event-emitter patterns
- Automatic retrying with customizable number of attempts and filtering functionality
- Cancellation of requests
- Configurable connect/socket timeouts
- Automatic parsing of JSON responses
- Automatic stringifying of JSON request bodies
- Automatic gzip unwrapping in Node
- Automatically prepend base URL
- Automatically follow redirects (configurable number of retries)
- Upload/download progress events
- Treat HTTP status codes >=400 as errors
- Debug requests with environment variables/localStorage setting

## Usage

How `get-it` behaves depends on which middleware you've loaded, but common to all approaches is the setup process.

```js
// Require the core get-it package, which is used to generate a requester
const getIt = require('get-it')

// And require whatever middleware you want to use
const base = require('get-it/lib/middleware/base')
const jsonResponse = require('get-it/lib/middleware/jsonResponse')
const promise = require('get-it/lib/middleware/promise')

// Now compose the middleware you want to use
const request = getIt([base('https://api.your.service/v1'), jsonResponse()])

// You can also register middleware using `.use(middleware)`
request.use(promise())

// Now you're ready to use the requester:
request({url: '/projects'})
  .then(response => console.log(response.body))
  .catch(err => console.error(err))
```

In most larger projects, you'd probably make a `httpClient.js` or similar, where you would instantiate the requester and export it for other modules to reuse.

## Options

- `url` - URL to the resource you want to reach.
- `method` - HTTP method to use for request. Default: `GET`, unless a body is provided, in which case the default is `POST`.
- `headers` - Object of HTTP headers to send. Note that cross-origin requests in IE9 will not be able to set these headers.
- `body` - The request body. If the `jsonRequest` middleware is used, it will serialize to a JSON string before sending. Otherwise, it tries to send whatever is passed to it using the underlying adapter. Supported types:
  - _Browser_: `string`, `ArrayBufferView`, `Blob`, `Document`, `FormData` (deprecated: `ArrayBuffer`)
  - _Node_: `string`, `buffer`, `ReadStream`
- `bodySize` - Size of body, in bytes. Only used in Node when passing a `ReadStream` as body, in order for progress events to emit status on upload progress.
- `timeout` - Timeout in millisecond for the request. Takes an object with `connect` and `socket` properties.
- `maxRedirects` - Maximum number of redirects to follow before giving up. Note that this is only used in Node, as browsers have built-in redirect handling which cannot be adjusted. Default: `5`
- `rawBody` - Set to `true` to return the raw value of the response body, instead of a string. The type returned differs based on the underlying adapter:
  - _Browser_: `ArrayBuffer`
  - _Node_: `Buffer`

## Return values

By default, `get-it` will return an object of single-channel event emitters. This is done in order to provide a low-level API surface that others can build upon, which is what the `promise` and `observable` middlewares do. Unless you really know what you're doing, you'll probably want to use those middlewares.

## Response objects

`get-it` does not expose the low-level primitives such as the `XMLHttpRequest` or `http.IncomingMessage` instances. Instead, it provides a response object with the following properties:

```js
{
  // string (ArrayBuffer or Buffer if `rawBody` is set to `true`)
  body: 'Response body'
  url: 'http://foo.bar/baz',
  method: 'GET',
  statusCode: 200,
  statusMessage: 'OK',
  headers: {
    'Date': 'Fri, 09 Dec 2016 14:55:32 GMT',
    'Cache-Control': 'public, max-age=120'
  }
}
```

## Promise API

For the most part, you simply have to register the middleware and you should be good to go. Sometimes you only need the response body, in which case you can set the `onlyBody` option to `true`. Otherwise the promise will be resolved with the response object mentioned earlier.

```js
const getIt = require('get-it')
const promise = require('get-it/lib/middleware/promise')
const request = getIt([promise({onlyBody: true})])

request({url: 'http://foo.bar/api/projects'})
  .then(projects => console.log(projects))
  .catch(err => console.error(err))
```

If you are targetting older browsers that do not have a global Promise implementation, you must register one globally using a polyfill such as [es6-promise](https://github.com/stefanpenner/es6-promise):

```js
require('es6-promise/auto')

const promise = require('get-it/lib/middleware/promise')
const request = getIt([promise()])
```

### Cancelling promise-based requests

With the Promise API, you can cancel requests using a _cancel token_. This API is based on the [Cancelable Promises proposal](https://github.com/tc39/proposal-cancelable-promises), which was at Stage 1 before it was withdrawn.

You can create a cancel token using the `CancelToken.source` factory as shown below:

```js
const promise = require('get-it/lib/middleware/promise')
const request = getIt([promise()])

const source = promise.CancelToken.source()

request
  .get({
    url: 'http://foo.bar/baz',
    cancelToken: source.token
  })
  .catch(err => {
    if (promise.isCancel(err)) {
      console.log('Request canceled', err.message)
    } else {
      // handle error
    }
  })

// Cancel the request (the message parameter is optional)
source.cancel('Operation canceled by the user')
```

## Observable API

The observable API requires you to pass an Observable-implementation that you want to use. Optionally, you can register it under the global `Observable`, but this is not recommended.

```js
const getIt = require('get-it')
const observable = require('get-it/lib/middleware/observable')
const request = getIt()

request.use(
  observable({
    implementation: require('zen-observable')
  })
)

const observer = request({url: 'http://foo.bar/baz'})
  .filter(ev => ev.type === 'response')
  .subscribe({
    next: res => console.log(res.body),
    error: err => console.error(err)
  })

// If you want to cancel the request, simply unsubscribe:
observer.unsubscribe()
```

It's important to note that the observable middleware does not only emit `response` objects, but also `progress` events. You should always filter to specify what you're interested in receiving. Every emitted value has a `type` property.

## Upcoming features

- Developer-friendly assertions that are stripped in production to reduce bundle size and performance
- Authentication (basic)
- Stream response middleware?

## Prior art

This module was inspired by the great work of others:

- [got](https://github.com/sindresorhus/got)
- [simple-get](https://github.com/feross/simple-get)
- [xhr](https://github.com/naugtur/xhr)
- [Axios](https://github.com/mzabriskie/axios/)
- [http-client](https://github.com/mjackson/http-client)
- [request](https://github.com/request/request)

## License

MIT-licensed. See LICENSE.
