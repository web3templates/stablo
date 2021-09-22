form-urlencoded
===============
**(c)[Bumblehead][0],[JBlashill][6] 2012-2017**

[![npm version](https://badge.fury.io/js/form-urlencoded.svg)](https://badge.fury.io/js/form-urlencoded) [![Build Status](https://travis-ci.org/iambumblehead/form-urlencoded.svg?branch=master)](https://travis-ci.org/iambumblehead/form-urlencoded)

Returns 'x-www-form-urlencoded' string data, an encoding often used when an [HTML form is submitted][1]. Form data is serialised in [this format][2] and sent to a server.

```javascript
var formurlencoded = require('form-urlencoded');
var obj = {
  str : 'val',
  num : 0,
  arr : [3, {prop : false}, 1, null, 6],
  obj : {prop1 : null, prop2 : ['elem']}
};

console.log(formurlencoded(obj));
// str=val&num=0&arr%5B0%5D=3&arr%5B1%5D%5Bprop%5D=false
// &arr%5B2%5D=1&arr%5B3%5D=null&arr%5B4%5D=6&obj%5Bprop
// 1%5D=null&obj%5Bprop2%5D%5B0%5D=elem

console.log(formurlencoded(obj, {
  ignorenull : true,
  skipIndex : true,
  sorted : true
}));
// arr%5B%5D=3&arr%5B%5D%5Bprop%5D=false&arr%5B%5D=1&arr
// %5B%5D=6&num=0&obj%5Bprop2%5D%5B%5D=elem&str=val
```

[0]: http://www.bumblehead.com                            "bumblehead"
[1]: http://www.w3.org/TR/html4/interact/forms.html#h-17.13.4.1  "w3c"
[2]: http://www.w3.org/TR/html5/forms.html#url-encoded-form-data "w3c"
[3]: http://nodejs.org/api/querystring.html               "node.js qs"
[4]: www.ruby-doc.org/stdlib-1.9.3/libdoc/uri/rdoc/URI.html    "rails"
[5]: https://github.com/visionmedia/node-querystring           "tj qs"
[6]: https://github.com/jblashill/form-urlencoded          "jblashill"
[7]: https://raw.githubusercontent.com/iambumblehead/es5classic/master/es5classic_120x120.png


![scrounge](https://github.com/iambumblehead/scroungejs/raw/master/img/hand.png)

(The MIT License)

Copyright (c) [Bumblehead][0] <chris@bumblehead.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   
