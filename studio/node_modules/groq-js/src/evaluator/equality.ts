import {Value} from './value'

export const isEqual = equality

async function equality(a: Value, b: Value): Promise<boolean> {
  let aType = a.getType()
  let bType = b.getType()
  if (aType !== bType) return false
  if (aType === 'number' || aType === 'string' || aType === 'boolean' || aType === 'null') {
    return (await a.get()) === (await b.get())
  }
  return false
}
