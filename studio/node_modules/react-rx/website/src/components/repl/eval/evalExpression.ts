import {evalCode} from './evalCode'

export const evalExpression = (code: string, scope = {}) =>
  evalCode(`return ${code}`, scope)
