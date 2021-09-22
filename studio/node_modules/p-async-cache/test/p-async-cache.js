const test = require('ava')
const AC = require('..')
const delay = require('delay')

test('options', t => {
  ;['string', 123, true, undefined, null].forEach(options => {
    t.throws(() => {
      new AC(options)
    }, 'options must be an object')
  })

  ;[new RegExp('boom', 'g'), {}, {load: true}].forEach(options => {
    t.throws(() => {
      new AC(options)
    }, 'options.load must be a function')
  })

  t.notThrows(() => {
    new AC({load: function () {}})
  }, 'does not throw since options.load is a function')
})


function times (fn, time) {
  const tasks = []
  let counter = 0
  while (counter < time) {
    tasks.push(fn(counter ++))
  }

  return Promise.all(tasks)
}

function value_times (value, time) {
  const tasks = []
  let counter = 0
  while (counter < time) {
    tasks.push(value)
    counter ++
  }

  return tasks
}

test('basic', t => {
  let counter = 0
  const ac = new AC({
    load: (a) => {
      return delay(100)
      .then(x => ++ counter + a)
    }
  })

  function create (input) {
    return times(() => {
      return ac.get(input)
    }, 10)
  }

  function run (input, output, stale = false) {
    return create(input)
    .then((result) => {
      t.deepEqual(result, value_times({value:output, stale}, 10), '')
    })
  }

  return run(0, 1)
  .then(() => {
    t.is(counter, 1, 'counter should be 1 since it should be queued')
    return delay(10)
  })
  .then(() => {
    return run(1, 3)
  })
  .then(() => {
    t.is(counter, 2, 'counter increases')
    return delay(10)
  })
})

test('allowStale', t => {
  const TIMES = 2

  let counter = 0
  const ac = new AC({
    maxAge: 100,
    stale: true,
    load: (a) => {
      return delay(100)
      .then(x => ++ counter + a)
    }
  })

  function create (input) {
    return times(() => {
      return ac.get(input)
    }, TIMES)
  }

  function run (input, output, stale = false, message) {
    return create(input)
    .then((result) => {
      t.deepEqual(
        result,
        value_times({value:output, stale}, TIMES),
        message)
    })
  }

  return run(0, 1, false, 'stale = false')
  .then(() => {
    return delay(105)
  })
  .then(() => {
    return run(0, 1, true, 'stale = true')
  })
})

test('case for readme', t => {
  const cache = new AC({
    stale: true,
    maxAge: 100,
    load (a, b) {
      return delay(1).then(() => a + b)
    }
  })

  return cache.get(1, 2)
  .then(({value, stale}) => {
    t.is(value, 3)
    t.is(stale, false)

    // Delay a timespan which is bigger than `maxAge`
    return delay(101).then(() => cache.get(1, 2))
  })
  .then(({value, stale}) => {
    t.is(value, 3)
    t.is(stale, true)

    return delay(10).then(() => cache.get(1, 2))
  })
  .then(({value, stale}) => {
    t.is(value, 3)
    t.is(stale, false)
  })
})
