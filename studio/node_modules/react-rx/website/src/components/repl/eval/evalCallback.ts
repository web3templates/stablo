import {evalCode} from './evalCode'

export const evalCallback = (
  code: string,
  callbackName = 'callback',
  scope = {}
): any => {
  let renderCount = 0
  let renderRes = null

  const callback = (arg: any) => {
    renderCount++
    renderRes = arg
  }

  evalCode(code, {...scope, [callbackName]: callback})

  if (renderCount === 0) {
    throw new Error(`${callbackName}() was not called`)
  }

  if (renderCount > 1) {
    throw new Error(`${callbackName}() was called more than once`)
  }

  return renderRes
}
