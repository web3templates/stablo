import * as babel from '@babel/standalone'
import transformTs from '@babel/plugin-transform-typescript'
import transformJsx from '@babel/plugin-transform-react-jsx'
import optionalChaining from '@babel/plugin-proposal-optional-chaining'

interface Options {
  filename?: string
  plugins?: any[]
}

export function compile(code: string, options: Options = {}) {
  return babel.transform(code, {
    filename: options.filename || 'Unknown.tsx',
    plugins: [
      ...(options.plugins || []),
      optionalChaining,
      [transformTs, {allExtensions: true, isTSX: true}],
      transformJsx
    ]
  })
}
