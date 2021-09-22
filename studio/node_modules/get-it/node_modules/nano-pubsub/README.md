# `nano-pubsub`

Tiny (<0.5 kb) publish/subscribe

## Install
```
npm install nano-pubsub
```

## Usage example
```js
const Pubsub = require('nano-pubsub')

const events = Pubsub()

const unsubscribe = events.subscribe(value => {
  console.log('got value:', value)
})

events.publish('Hello')
// => 'got value: Hello'

events.publish('World')
// => 'got value: World'

unsubscribe()

events.publish('Something')

// ...nothing
```
