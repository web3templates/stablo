export interface Subscriber<Event> {
  (event: Event): void
}
export interface PubSub<Message> {
  publish: (message: Message) => void
  subscribe: (subscriber: Subscriber<Message>) => () => void
}

export default function createPubSub<Message = void>(): PubSub<Message> {
  const subscribers: Subscriber<Message>[] = []
  function subscribe(subscriber: Subscriber<Message>) {
    const idx = subscribers.push(subscriber) - 1
    return function unsubscribe() {
      subscribers.splice(idx, 1)
    }
  }

  function publish(event: Message) {
    subscribers.forEach((subscriber) => subscriber(event))
  }

  return {
    publish,
    subscribe,
  }
}
