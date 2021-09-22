const {test} = require('tap')
const Pubsub = require('./')

test('it receives messages', t => {
  const events = Pubsub()
  events.subscribe(value => {
    t.equal(value, 'hello')
    t.end()
  })
  events.publish('hello')
})

test('it does not receive messages after unsubscribe', t => {
  const events = Pubsub()
  const unsubscribe = events.subscribe(() => {
    t.fail('Did not expect to be called')
  })
  unsubscribe()
  events.publish('hello')
  t.end()
})

test('subscribers are called with arguments passed to publish', t => {
  const events = Pubsub()

  events.subscribe((arg1, arg2, arg3) => {
    t.equal(arg1, 'hello')
    t.equal(arg2, 'there')
    t.equal(arg3, 'planet')
    t.end()
  })
  events.publish('hello', 'there', 'planet')
})