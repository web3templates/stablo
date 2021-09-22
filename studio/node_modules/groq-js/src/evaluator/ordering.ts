import {getType, GroqValueName} from './value'

const TYPE_ORDER: {[key in GroqValueName]?: number} = {
  number: 1,
  string: 2,
  boolean: 3
}

export function partialCompare(a: any, b: any) {
  let aType = getType(a)
  let bType = getType(b)

  if (aType !== bType) return null

  switch (aType) {
    case 'number':
    case 'boolean':
      return a - b
    case 'string':
      return a < b ? -1 : a > b ? 1 : 0
  }

  return null
}

export function totalCompare(a: any, b: any) {
  let aType = getType(a)
  let bType = getType(b)

  let aTypeOrder = TYPE_ORDER[aType] || 100
  let bTypeOrder = TYPE_ORDER[bType] || 100

  if (aTypeOrder !== bTypeOrder) {
    return aTypeOrder - bTypeOrder
  }

  let result = partialCompare(a, b)
  if (result === null) result = 0
  return result
}
