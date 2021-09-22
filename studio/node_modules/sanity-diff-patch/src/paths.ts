import {KeyedSanityObject} from './diffPatch'

export type PathSegment = string | number | {_key: string} | [number | '', number | '']
export type Path = PathSegment[]

export function pathToString(path: Path): string {
  return path.reduce((target: string, segment: PathSegment, i: number) => {
    if (Array.isArray(segment)) {
      return `${target}[${segment.join(':')}]`
    }

    if (isKeyedObject(segment)) {
      return `${target}[_key=="${segment._key}"]`
    }

    if (typeof segment === 'number') {
      return `${target}[${segment}]`
    } else if (/^\d+$/.test(segment)) {
      return `${target}["${segment}"]`
    }

    if (typeof segment === 'string') {
      const separator = i === 0 ? '' : '.'
      return `${target}${separator}${segment}`
    }

    throw new Error(`Unsupported path segment "${segment}"`)
  }, '')
}

function isKeyedObject(obj: any): obj is KeyedSanityObject {
  return typeof obj === 'object' && typeof obj._key === 'string'
}
