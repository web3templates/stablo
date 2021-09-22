const test = require('ava')
const Queue = require('..')
const delay = require('delay')

function times (fn, time) {
  const tasks = []
  let counter = 0
  while (counter < time) {
    tasks.push(fn(counter ++))
  }
  return tasks
}

test('single param', t => {
  let counter = 0
  const queue = new Queue({
    load: a => {
      return delay(100)
      .then(() => {
        counter ++
        return a
      })
    }
  })

  const tasks = times(() => {
    return queue.add(1).then((value) => {
      t.is(value, 1)
    })
  }, 10)

  return Promise.all(tasks)
  .then(() => {
    t.is(counter, 1)
  })
})


test('multiple params', t => {
  let counter = 0
  const queue = new Queue({
    load: (a, b) => {
      return delay(100)
      .then(() => {
        counter ++
        return a + b
      })
    }
  })

  const tasks = times(() => {
    return queue.add(1, 2).then((value) => {
      t.is(value, 3)
    })
  }, 10)

  return Promise.all(tasks)
  .then(() => {
    t.is(counter, 1)
  })
})


test('sync loader', t => {
  const queue = new Queue({
    load: a => a
  })

  const tasks = times(() => {
    return queue.add(1).then((value) => {
      t.is(value, 1)
    })
  }, 10)

  return Promise.all(tasks)
})


test('value should not be cached', t => {
  let counter = 0
  const queue = new Queue({
    load: () => {
      return delay(100)
      .then(() => {
        return counter ++
      })
    }
  })

  const tasks = times(() => {
    return queue.add().then((value) => {
      t.is(value, 0)
    })
  }, 10)

  return Promise.all(tasks)
  .then(() => {
    return delay(200)
  })
  .then(() => {
    return queue.add()
  })
  .then((value) => {
    t.is(value, 1)
  })
})


test('addWithKey, multiple params, normal cases', t => {
  let counter = 0
  const queue = new Queue({
    load: (a, b) => {
      return delay(100)
      .then(() => {
        counter ++
        return a + b
      })
    }
  })

  const tasks = times(() => {
    return queue.addWithKey('a', 1, 2).then((value) => {
      t.is(value, 3)
    })
  }, 10)

  return Promise.all(tasks)
  .then(() => {
    t.is(counter, 1)
  })
})


test('addWithKey, multiple params, changed keys', t => {
  let counter = 0
  const queue = new Queue({
    load: (a, b) => {
      return delay(100)
      .then(() => {
        counter ++
        return a + b
      })
    }
  })

  const tasks = times((i) => {
    return queue.addWithKey(i, 1, 2).then((value) => {
      t.is(value, 3)
    })
  }, 10)

  return Promise.all(tasks)
  .then(() => {
    t.is(counter, 10)
  })
})


test('load event should be emitted once and only once for one task', t => {
  let counter = 0
  const queue = new Queue({
    load: () => {
      return delay(100)
      .then(() => 1)
    }
  })
  .on('load', (key, value) => {
    t.is(value, 1, 'value should be 1')
    counter ++
  })

  const tasks = times(() => {
    return queue.add()
  }, 10)

  return Promise.all(tasks)
  .then(() => {
    t.is(counter, 1, 'counter should be 1')
  })
})