same-origin
===========

Checks if two URLs pass the "same origin"-policy (RFC 6454)

[![Build Status](https://travis-ci.org/rexxars/same-origin.svg?branch=master)](https://travis-ci.org/rexxars/same-origin)

[![browser support](https://ci.testling.com/rexxars/same-origin.png)
](https://ci.testling.com/rexxars/same-origin)

Installation
============

Run `npm install --save same-origin` to include it in your project.

Works well with browserify.

Usage
=====

```js
var sameOrigin = require('same-origin');
var url1 = 'http://example.com/some/page.html';
var url2 = 'http://example.com/some/other/page.html';
var url3 = 'http://espen.codes/nodejs';
sameOrigin(url1, url2); // true
sameOrigin(url1, url3); // false
```

`same-origin` works in most environments:

```js
// CommonJS
var sameOrigin = require('same-origin');

// AMD (Require.JS, yepnope, dojo...)
define(['same-origin'], function(sameOrigin) {
    // ...
});

// Browser global (if CommonJS/AMD environment not found)
window.sameOrigin(url1, url2);
```

License
=======

MIT-licensed. See LICENSE.