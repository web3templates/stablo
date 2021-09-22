import {Observable, of} from 'rxjs'

const tryParse = <T>(val: any, defaultValue: T): T => {
  try {
    return JSON.parse(val)
  } catch (err) {
    return defaultValue
  }
}

const get = <T>(key: string, defValue: T): Observable<T> => {
  const val = localStorage.getItem(key)
  return of(val === null ? defValue : tryParse<T>(val, defValue))
}

const set = <T>(key: string, nextValue: T): Observable<T> => {
  // Can't stringify undefined, and nulls are what
  // `getItem` returns when key does not exist
  if (typeof nextValue === 'undefined' || nextValue === null) {
    localStorage.removeItem(key)
  } else {
    localStorage.setItem(key, JSON.stringify(nextValue))
  }
  return of(nextValue)
}

export default {get, set}
