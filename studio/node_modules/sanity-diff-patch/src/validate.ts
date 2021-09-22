import {DiffError} from './diffError'
import {Path} from './paths'

const idPattern = /^[a-z0-9][a-z0-9_.-]+$/i
const keyPattern = /^[a-zA-Z_][a-zA-Z0-9_]*$/
const keyStartPattern = /^[a-z_]/i

export function validateDocument(item: unknown, path: Path = []): boolean {
  if (Array.isArray(item)) {
    return item.every((child, i) => {
      if (Array.isArray(child)) {
        throw new DiffError('Multi-dimensional arrays not supported', path.concat(i))
      }

      return validateDocument(child, path.concat(i))
    })
  }

  if (typeof item === 'object' && item !== null) {
    const obj = item as {[key: string]: any}
    return Object.keys(obj).every(
      key => validateKey(key, obj[key], path) && validateDocument(obj[key], path.concat(key))
    )
  }

  return true
}

export function validateKey(key: string, value: any, path: Path): string {
  if (!keyStartPattern.test(key)) {
    throw new DiffError('Keys must start with a letter (a-z)', path.concat(key), value)
  }

  if (!keyPattern.test(key)) {
    throw new DiffError(
      'Keys can only contain letters, numbers and underscores',
      path.concat(key),
      value
    )
  }

  if (key === '_key' || key === '_ref' || key === '_type') {
    if (typeof value !== 'string') {
      throw new DiffError('Keys must be strings', path.concat(key), value)
    }

    if (!idPattern.test(value)) {
      throw new DiffError('Invalid key - use less exotic characters', path.concat(key), value)
    }
  }

  return key
}
