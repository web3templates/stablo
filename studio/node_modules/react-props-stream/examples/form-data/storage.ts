import {of as observableOf} from 'rxjs'

const tryParse = (val, defaultValue) => {
  try {
    return JSON.parse(val)
  } catch (err) {
    return defaultValue
  }
}

const get = (key, defValue) => {
  const val = localStorage.getItem(key)
  return observableOf(val === null ? defValue : tryParse(val, defValue))
}

const set = (key, nextValue) => {
  // Can't stringify undefined, and nulls are what
  // `getItem` returns when key does not exist
  if (typeof nextValue === 'undefined' || nextValue === null) {
    localStorage.removeItem(key)
  } else {
    localStorage.setItem(key, JSON.stringify(nextValue))
  }
  return observableOf(nextValue)
}

export default {get, set}
