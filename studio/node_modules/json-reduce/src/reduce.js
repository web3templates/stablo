// @flow

import type {Path, Reducer} from './types'

type Primitive = string | number | boolean

function isObject(value) {
  return value !== null && typeof value === 'object'
}

function reducePrimitive<Value: Primitive, Accumulator>(
  value: Value,
  reducer: Reducer<Value, Accumulator>,
  accumulator: Accumulator,
  path: Path
): Accumulator {
  return reducer(accumulator, value, path)
}

function reduceArray<Value: Array<*>, Accumulator>(
  value: Value,
  reducer: Reducer<Value, Accumulator>,
  accumulator: Accumulator,
  path: Path
): Accumulator {
  return value.reduce(
    (acc, item, index) => reduce(item, reducer, acc, path.concat(index)),
    reducer(accumulator, value, path)
  )
}

function reduceObject<Value: Object, Accumulator>(
  value: Value,
  reducer: Reducer<Value, Accumulator>,
  accumulator: Accumulator,
  path: Path
): Accumulator {
  return Object.keys(value).reduce(
    (acc, key, i) => reduce(value[key], reducer, acc, path.concat(key)),
    reducer(accumulator, value, path)
  )
}

const ROOT_PATH = []

export default function reduce<Value: any, Accumulator>(
  value: Value,
  reducer: Reducer<Value, Accumulator>,
  accumulator: Accumulator,
  path: Path = ROOT_PATH
): Accumulator {
  if (Array.isArray(value)) {
    return reduceArray(value, reducer, accumulator, path)
  }
  if (isObject(value)) {
    return reduceObject(value, reducer, accumulator, path)
  }
  return reducePrimitive(value, reducer, accumulator, path)
}
