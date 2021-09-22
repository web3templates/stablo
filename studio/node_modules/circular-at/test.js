const {test} = require('tap')
const at = require('./')

const tests = [
  [
    [],
    [[0, undefined],
      [1, undefined],
      [-0, undefined],
      [-1, undefined]]
  ],
  [
    ['a', 'b', 'c'],
    [['foo', undefined],
      [NaN, undefined],
      ['a', undefined]
    ]
  ],
  [
    ['foo'],
    [[0, 'foo'],
      [1, 'foo'],
      [2, 'foo'],
      [0, 'foo'],
      [-1, 'foo'],
      [-2, 'foo']]
  ],
  [
    {foo: 'bar'},
    [[0, undefined],
      [1, undefined],
      ['foo', 'bar']]
  ],
  [
    {length: 2, '0': 'foo', '1': 'bar', a: 'a'},
    [['0', 'foo'],
      ['1', 'bar'],
      [1, 'bar'],
      ['2', 'foo'],
      [2, 'foo'],
      ['-1', 'bar'],
      [-1, 'bar'],
      ['-2', 'foo'],
      [-2, 'foo'],
      ['a', 'a']]
  ],
  [
    ['foo', 'bar', 'baz', 'qux'],
    [[0, 'foo'],
      [1, 'bar'],
      [2, 'baz'],
      [3, 'qux'],
      [4, 'foo'],
      [5, 'bar'],
      [6, 'baz'],
      [7, 'qux'],
      [8, 'foo'],
      [9, 'bar'],
      [-0, 'foo'],
      [-1, 'qux'],
      [-2, 'baz'],
      [-3, 'bar'],
      [-4, 'foo'],
      [-5, 'qux'],
      [-6, 'baz'],
      [-7, 'bar'],
      [-8, 'foo']]
  ]
]

test('it throws with native errors if value is not an array', t => {
  t.throws(() => at(null, 4), /Cannot read property '4' of null/)
  t.throws(() => at(undefined, 4), /Cannot read property '4' of undefined/)
  t.end()
})

test('it works as expected', t => {
  tests.forEach(([value, examples]) => {
    examples.forEach(([index, expected]) => {
      const got = at(value, index)
      t.equal(got, expected, `Expected at(${JSON.stringify(value)}, ${index}) to be ${expected}, got ${got}`)
    })
  })
  t.end()
})
