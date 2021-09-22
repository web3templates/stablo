'use strict'

const mocha = require('mocha')
const assert = require('assert')
const resolveSound = require('./fixture')
const promiseProps = require('..')

const describe = mocha.describe
const it = mocha.it

describe('promise-props-recursive', function() {
  it('should handle flat objects with no promises', function(done) {
    const input = {cow: 'moo', horse: 'neigh'}
    promiseProps(input).then(function(res) {
      assert.deepEqual(res, input)
      done()
    })
  })

  it('should handle flat objects with only promises', function(done) {
    const input = {cow: resolveSound('cow'), horse: resolveSound('horse')}
    promiseProps(input).then(function(res) {
      assert.deepEqual(res, {cow: 'moo', horse: 'neigh'})
      done()
    })
  })

  it('should handle flat objects with mix of promises and primitives', function(done) {
    const input = {cow: 'moo', horse: resolveSound('horse')}
    promiseProps(input).then(function(res) {
      assert.deepEqual(res, {cow: 'moo', horse: 'neigh'})
      done()
    })
  })

  it('should handle rejections on flat structures', function(done) {
    const input = {cow: resolveSound('cow', true), horse: resolveSound('horse')}
    promiseProps(input).then(function(res) {
      throw new Error('Should not call success handler on failure')
    }).catch(function(err) {
      assert.equal(err, 'told to fail')
      done()
    })
  })

  it('should handle nested objects with no promises', function(done) {
    const input = {
      cow: 'moo',
      horse: 'neigh',
      birds: {
        tit: 'tweet',
        parrot: 'tweet'
      }
    }

    promiseProps(input).then(function(res) {
      assert.deepEqual(res, input)
      done()
    })
  })

  it('should handle nested objects with promises', function(done) {
    const input = {
      cow: 'moo',
      horse: resolveSound('horse'),
      birds: {
        tit: resolveSound('tit'),
        parrot: 'tweet'
      }
    }

    promiseProps(input).then(function(res) {
      assert.deepEqual(res, {
        cow: 'moo',
        horse: 'neigh',
        birds: {
          tit: 'tweet',
          parrot: 'tweet'
        }
      })
      done()
    }).catch(function(err) {
      throw new Error(err)
    })
  })

  it('should handle deeply nested objects without promises', function(done) {
    const input = {
      cow: 'moo',
      horse: 'neigh',
      birds: {
        tit: 'tit',
        parrots: {
          something: 'other',
          other: 'something'
        }
      }
    }

    promiseProps(input).then(function(res) {
      assert.deepEqual(res, input)
      done()
    }).catch(function(err) {
      throw new Error(err)
    })
  })

  it('should handle deeply nested objects with promises', function(done) {
    const input = {
      cow: resolveSound('cow'),
      horse: 'neigh',
      birds: {
        tit: resolveSound('tit'),
        nonbirds: {
          cricket: resolveSound('cricket'),
          dog: resolveSound('dog')
        }
      }
    }

    promiseProps(input).then(function(res) {
      assert.deepEqual(res, {
        cow: 'moo',
        horse: 'neigh',
        birds: {
          tit: 'tweet',
          nonbirds: {
            cricket: 'chirp',
            dog: 'bark'
          }
        }
      })
      done()
    }).catch(function(err) {
      throw new Error(err)
    })
  })

  it('should handle rejections from deeply nested objects with promises', function(done) {
    const input = {
      cow: resolveSound('cow'),
      horse: 'neigh',
      birds: {
        tit: resolveSound('tit'),
        nonbirds: {
          cricket: resolveSound('cricket', true),
          dog: resolveSound('dog')
        }
      }
    }

    promiseProps(input).then(function(res) {
      throw new Error('Success handler should not be called when deeply nested promise is rejected')
    }).catch(function(err) {
      assert.equal(err, 'told to fail')
      done()
    })
  })

  // @todo implement
  it.skip('should resolve deeply nested objects that return promises', function(done) {
    const input = {
      cow: resolveSound('cow'),
      horse: 'neigh',
      birds: {
        tit: resolveSound('tit'),
        nonbirds: {
          cricket: resolveSound('cricket'),
          felines: new Promise(function(resolve) {
            setImmediate(resolve, {
              cat: resolveSound('cat'),
              lion: resolveSound('lion')
            });
          })
        }
      }
    }

    promiseProps(input).then(function(res) {
      assert.deepEqual(res, {
        cow: 'moo',
        horse: 'neigh',
        birds: {
          tit: 'tweet',
          nonbirds: {
            cricket: 'chirp',
            felines: {
              cat: 'meow',
              lion: 'roar'
            }
          }
        }
      })
      done()
    }).catch(function(err) {
      throw new Error(err)
    })
  })
})
