import * as React from 'react'

import * as globalScope from '../../examples/_utils/globalScope'
import {Checkerboard} from './Checkerboard'
import {ShowError} from './ShowError'
import {CodeMirror} from './CodeMirror'
import {compile} from './compile/babel'
import {evalReactDomRender} from './eval/evalReactDomRender'
import {Prelude} from './Prelude'
import {EvalCode} from './EvalCode'
import './codemirror-lib'
import styled from 'styled-components'

const fs = require('fs')

interface Scope {
  [variableName: string]: any
}

interface Props {
  source: string
  scope?: Scope
  filename: string
  prelude?: string
}

const tryCompile = (code: string, filename: string) => {
  try {
    return [null, compile(code, {filename})?.code || '']
  } catch (error) {
    return [error]
  }
}

const evalRender = (code: string, scope: Scope = {}) => {
  return evalReactDomRender(code, {
    ...scope,
    ...globalScope
  })
}

const COMMON_PRELUDE = `import {rxComponent, observeEvent, observeContext, observeState, forwardRef} from 'react-rx'\n${
  fs
    .readFileSync(`${__dirname}/../../examples/_utils/globalScope.ts`, 'utf-8')
    .split('//@endimport')[0]
}`

const stripImports = (str: string) => {
  return str
    .split('//@endimport')
    .slice(-1)[0]
    .trim()
}

const CODEMIRROR_MODE = {
  name: 'jsx',
  base: {name: 'javascript', typescript: true}
}

const CODEMIRROR_OPTIONS = {
  theme: 'custom',
  smartIndent: false,
  tabSize: 2,
  mode: CODEMIRROR_MODE
}

const StyledWrapper = styled.div`
  @media (max-width: 979px) {
    display: block;
  }
  @media (min-width: 1280px) {
    display: flex;
    align-items: stretch;
    flex-direction: row;
  }
`
const Header = styled.div`
  color: #d8d8d8;
  font-size: 0.9em;
  text-transform: uppercase;
  padding: 0.5em 1.5em;
`
const BORDER_RADIUS = 0.5
const Column = styled.div<{type: 'editor' | 'result'}>`
  @media (min-width: 1280px) {
    border-radius: ${props =>
      props.type === 'editor'
        ? `${BORDER_RADIUS}em 0 0 ${BORDER_RADIUS}em`
        : `0 ${BORDER_RADIUS}em ${BORDER_RADIUS}em 0`};
    padding: ${props =>
      props.type === 'editor' ? '0 1px 0.5em 0' : '0 0 0.5em 1px'};
  }
  @media (max-width: 1279px) {
    border-radius: ${props =>
      props.type === 'editor'
        ? `${BORDER_RADIUS}em ${BORDER_RADIUS}em 0 0`
        : `0 0 ${BORDER_RADIUS}em ${BORDER_RADIUS}em`};
    padding: ${props => (props.type === 'editor' ? '0' : '0 0 0.5em 0')};
  }
  flex: 0 0 ${props => (props.type === 'editor' ? 60 : 40)}%;
  background: #282c34;
`

export function CodeBlock(props: Props) {
  const source = stripImports(props.source)
  const [code, setCode] = React.useState(source.trim())

  const [compileError, transformed] = tryCompile(code, props.filename)
  return (
    <StyledWrapper>
      <Column type="editor">
        <Header>Live editor</Header>
        <Prelude
          mode={CODEMIRROR_MODE}
          value={`${COMMON_PRELUDE}${props.prelude ? props.prelude : ''}`}
        />
        <CodeMirror
          value={code}
          options={CODEMIRROR_OPTIONS}
          onBeforeChange={(editor, data, value) => {
            setCode(value)
          }}
        />
      </Column>
      <Column type="result">
        <Header>Result</Header>
        <Checkerboard>
          <div style={{padding: '2em'}}>
            {compileError ? (
              <ShowError title="Compile error">
                {compileError.message}
              </ShowError>
            ) : (
              <EvalCode
                code={transformed}
                evalWith={src => evalRender(src, props.scope)}
                renderError={error => (
                  <ShowError title="Runtime error">{error.message}</ShowError>
                )}
              />
            )}
          </div>
        </Checkerboard>
      </Column>
    </StyledWrapper>
  )
}
