# `nano-pubsub`

Tiny (<0.5 kb) publish/subscribe

## Install
```
npm install nano-pubsub
```

## Usage example
```js
import createPubsub from 'nano-pubsub'

const events = createPubsub()

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
