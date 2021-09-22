'use strict'

import test from 'ava'
import humanizeList from './'

test('returns the correct humanized list', t => {
  t.plan(1)

  t.same(humanizeList(['apples', 'tomatoes', 'unicorns']), 'apples, tomatoes and unicorns')
})

test('handles a single element list', t => {
  t.plan(1)

  t.same(humanizeList(['foo']), 'foo')
})

test('adds the oxford comma when set to true', t => {
  t.plan(1)

  t.same(humanizeList(['apples', 'tomatoes', 'unicorns'], { oxfordComma: true }), 'apples, tomatoes, and unicorns')
})

test('adds a custom conjunction when specified', t => {
  t.plan(1)

  t.same(humanizeList(['apples', 'tomatoes', 'unicorns'], { conjunction: 'or' }), 'apples, tomatoes or unicorns')
})

test('skips the conjunction when specified', t => {
  t.plan(1)

  t.same(humanizeList(['apples', 'tomatoes', 'unicorns'], { skipConjunction: true }), 'apples, tomatoes, unicorns')
})
