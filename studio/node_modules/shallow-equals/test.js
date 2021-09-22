var equals = require('./')
var test = require('tape')

test('arrays', function(t) {
  t.ok(equals(
      [1, 2, 3, 4, 5]
    , [1, 2, 3, 4, 5]
  ), 'simplest use case')

  t.ok(equals(
      [1, 2, 3, 4, 5]
    , [10, 20, 30, 40, 50]
    , function(a, b) {
      return a === b/10
    }
  ), 'custom comparator')

  t.notOk(equals(
      [1, 2, 3, 4, 5]
    , [5, 4, 3, 2, 1]
  ), 'same contents, different order')

  t.notOk(equals(
      [1, 2, 3, 4, 5]
    , [1, 2, 3, 4, 5, 6]
  ), 'equal to a point')


  t.notOk(equals(
      ['a', 'b', 'c']
    , { 0: 'a', 1: 'b', 2: 'c' }
  ), 'will not compare with objects')

  t.notOk(equals(
      ['a', 'b', 'c']
    , 'abc'
  ), 'will not compare with strings')

  t.end()
})

test('objects', function(t) {
  t.ok(equals(
      { a: 'a', b: 'b', c: 'c' }
    , { a: 'a', b: 'b', c: 'c' }
  ), 'simplest use case')

  t.ok(equals(
      { a: 'a', b: 'b', c: 'c' }
    , { a: 'aa', b: 'bb', c: 'cc' }
    , function(a, b) {
      return a+a === b
    }
  ), 'custom comparator')

  t.notOk(equals(
      {}
    , null
  ), 'comparing to null')

  t.notOk(equals(
      { a: 'b', b: 'c', a: 'a' }
    , { a: 'a', b: 'b', c: 'c' }
  ), 'same contents, different order')

  t.notOk(equals(
      { a: 'a', b: 'b', c: 'c', d: 'd' }
    , { a: 'a', b: 'b', c: 'c' }
  ), 'equal to a point')

  t.notOk(equals(
      { 0: 'a', 1: 'b', 2: 'c' }
    , ['a', 'b', 'c']
  ), 'will not compare with arrays')

  t.notOk(equals(
      { 0: 'a', 1: 'b', 2: 'c' }
    , 'abc'
  ), 'will not compare with strings')

  t.end()
})

test('other', function(t) {
  t.ok(equals(null, null), 'null')
  t.ok(equals('hello', 'hello'), 'simplest use case')
  t.ok(equals('hello', 'HELLO', function(a, b) {
    return a.toUpperCase() === b
  }), 'custom comparator')

  t.end()
})
