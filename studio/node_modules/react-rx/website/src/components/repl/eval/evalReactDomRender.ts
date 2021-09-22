import {evalCode} from './evalCode'

export const evalReactDomRender = (code: string, scope = {}): any => {
  let renderCount = 0
  let renderRes = null

  const callback = (arg: any) => {
    renderCount++
    renderRes = arg
  }

  evalCode(code, {...scope, ReactDOM: {render: callback}})

  if (renderCount === 0) {
    throw new Error(`ReactDOM.render() was never called`)
  }

  if (renderCount > 1) {
    throw new Error(`ReactDOM.render() was called more than once`)
  }

  return renderRes
}
