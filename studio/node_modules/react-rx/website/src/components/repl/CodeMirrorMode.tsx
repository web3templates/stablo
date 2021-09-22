import {rxComponent} from 'react-rx'
import {map, switchMap, toArray} from 'rxjs/operators'
import * as React from 'react'
import styled from 'styled-components'
import {runMode} from './runMode'

export interface CodeMirrorModeProps {
  mode: null | {name: string; base?: any}
  highlighted?: number[]
  children: string
  className?: string
}

export const CodeMirrorMode = rxComponent<CodeMirrorModeProps>(
  (props$) => {
    return props$.pipe(
      switchMap((props) =>
        runMode(props.children, props.mode).pipe(
          toArray(),
          map((lines, i) => (
            <Code
              key={`line-${i}`}
              className={`cm-s-custom${
                props.className ? ` ${props.className}` : ''
              }`}
            >
              {lines.map((line, lineNo) => (
                <div
                  key={`line-${i}-${lineNo}`}
                  className={`cm-line${
                    (props.highlighted || []).includes(lineNo + 1)
                      ? ' CodeMirror-selected'
                      : ''
                  }`}
                >
                  {line.map((token, i) =>
                    token.style ? (
                      <span key={i} className={`cm-${token.style}`}>
                        {token.token}
                      </span>
                    ) : (
                      token.token
                    )
                  )}
                </div>
              ))}
            </Code>
          ))
        )
      )
    )
  }
)

const Code = styled.div`
  font-size: 0.8em;

  background-color: rgb(40, 44, 52);
  color: #fff;
  margin: 0;
  white-space: pre;
  overflow: auto;
  padding: 0.9rem;
  font-family: source-code-pro, Menlo, Monaco, Consolas, Courier New, monospace;
  -webkit-font-smoothing: antialiased;
  line-height: 1.4em;
`
