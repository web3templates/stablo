# shallow-equals [![Flattr this!](https://api.flattr.com/button/flattr-badge-large.png)](https://flattr.com/submit/auto?user_id=hughskennedy&url=http://github.com/hughsk/shallow-equals&title=shallow-equals&description=hughsk/shallow-equals%20on%20GitHub&language=en_GB&tags=flattr,github,javascript&category=software)[![experimental](http://hughsk.github.io/stability-badges/dist/experimental.svg)](http://github.com/hughsk/stability-badges) #

Determine if an array or object is equivalent with another, *not* recursively.

## Usage ##

[![shallow-equals](https://nodei.co/npm/shallow-equals.png?mini=true)](https://nodei.co/npm/shallow-equals)

### `equals(a, b, [compare])` ###

Check if `a` and `b` are pretty much the same thing. Note this won't be the
case if `a` and `b` are different types (e.g. Array vs. Object, String vs.
Function).

By default, all comparisons between values are using the strict equality
(`===`) operator. You can also pass in a custom `compare` function to override
this behavior.

``` javascript
var equals = require('shallow-equals')

// true:
equals([1, 2, 3], [1, 2, 3])

// true:
equals({ hello: 'world' }, { hello: 'world' })

// false:
equals([1, 2, {}], [1, 2, {}])

// true:
equals([1, 2], [
  { value: 1 },
  { value: 2 }
], function(a, b) {
  return a === b.value
})
```

## License ##

MIT. See [LICENSE.md](http://github.com/hughsk/shallow-equals/blob/master/LICENSE.md) for details.
