# circular-at

Access array items at any positive or negative index. If the index is out of bounds, it will be wrapped around the length of the array.

## For example:

```js
import at from 'circular-at'

const array = ['a', 'b', 'c']

at(array, 0) === 'a'
at(array, 1) === 'b'
at(array, 2) === 'c'
at(array, 3) === 'a'
at(array, 4) === 'b'
at(array, 5) === 'c'

// ... and so on
```

This goes for negative indices as well:
```js
at(array, -1) === 'c'
at(array, -2) === 'b'
at(array, -3) === 'a'
at(array, -4) === 'c'
at(array, -5) === 'b'

// ... and so on
```

If the given value is not an array, it behaves like `value[index]`

## Install
```
npm install circular-at
```

## License
MIT
