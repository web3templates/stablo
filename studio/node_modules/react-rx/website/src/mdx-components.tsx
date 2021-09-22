import {CodeMirrorMode} from './components/repl/CodeMirrorMode'

import * as React from 'react'
import styled from 'styled-components'
import {rxComponent} from 'react-rx'
import {map} from 'rxjs/operators'
import {combineLatest} from 'rxjs'
import {location$} from './datastores/location'
import {parseCodeFenceHeader} from './utils/parseCodeFenceHeader'
import {ModeSpec} from './components/repl/runMode'

const ModeWrapper = styled.div`
  color: #fff;
`

const InlineCode = styled.code`
  font-size: 0.9em;
  background-color: #e4e4e4;
  padding: 1px 4px;
  border-radius: 2px;
`

const CODEMIRROR_TSX_MODE: ModeSpec = {
  name: 'jsx',
  base: {name: 'javascript', typescript: true}
}

const TSX_MODE_TYPES = ['js', 'jsx', 'tsx', 'ts']

interface InlineCodeProps {
  children: string
}

interface CodeProps {
  children: string
  className: 'language-js' | 'language-jsx' | 'language-tsx'
}

export const components = {
  inlineCode: InlineCode,
  code: (props: CodeProps) => {
    const [lang, range] = parseCodeFenceHeader(
      props.className.replace(/^language-/, '')
    )
    const mode =
      lang && TSX_MODE_TYPES.includes(lang) ? CODEMIRROR_TSX_MODE : null
    return (
      <ModeWrapper>
        <CodeMirrorMode highlighted={range} mode={mode}>
          {props.children}
        </CodeMirrorMode>
      </ModeWrapper>
    )
  }
}

const hash$ = location$.pipe(map(location => location.hash))

const BookmarkedLink = rxComponent<{
  href: string
  children: React.ReactNode
}>(props$ =>
  combineLatest([props$, hash$]).pipe(
    map(([props, hash]) => (
      <a href={props.href} className={hash === props.href ? 'selected' : ''}>
        {props.children}
      </a>
    ))
  )
)

export const tocComponents = {
  a: BookmarkedLink
}
