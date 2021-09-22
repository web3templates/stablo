import {flatten, range, uniq} from 'lodash'

const regex = /^([a-z0-9\s_-]+)({([0-9,-]+)})*/

function isNum(v: any) {
  return !isNaN(v)
}

export function parseCodeFenceHeader(header: string): [string, number[]?] {
  const match = regex.exec(header)
  if (!match) {
    throw new Error(`Unparseable code fence header: ${header}`)
  }
  const [, lang, , range] = match

  return range ? [lang, parseRange(range)] : [lang]
}

function parseRange(nums: string) {
  return uniq(flatten(nums.split(',').map(expandRange))).filter(isNum)
}

function expandRange(rangeStr: string) {
  if (rangeStr.includes('-')) {
    const numRange = rangeStr
      .split('-')
      .map(n => Number(n))
      .sort()
    return range(numRange[numRange.length - 1], numRange[0])
  }
  return [Number(rangeStr)]
}
