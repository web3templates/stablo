export const evalCode = (code: string, scope: {[v: string]: any}) => {
  const scopeKeys = Object.keys(scope)
  const scopeValues = scopeKeys.map(key => scope[key])
  // eslint-disable-next-line no-new-func
  const res = new Function(...scopeKeys, code)
  return res(...scopeValues)
}
