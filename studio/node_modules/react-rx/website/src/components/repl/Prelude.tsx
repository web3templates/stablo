import * as React from 'react'
import styled from 'styled-components'
import {CodeMirrorMode} from './CodeMirrorMode'

const Details = styled.details`
  text-align: right;
  white-space: pre;
  background-color: #1f222a;
  line-height: 1.4em;
  border: 0;
  box-sizing: border-box;
`

const Summary = styled.summary`
  background-color: #242831;
  display: inline-block;
  color: #65737e;
  font-size: 0.8em;
  border-radius: 2px 2px 0 0;
  margin: 1px 0 0 0;
  text-transform: uppercase;
  padding: 0.4em 0.9em;
  font-family: source-code-pro, Menlo, Monaco, Consolas, Courier New, monospace;
  -webkit-font-smoothing: antialiased;
  outline: none;
`

const StyledCodeMirrorMode = styled(CodeMirrorMode)`
  opacity: 0.7;
  text-align: left;
`

interface Props {
  mode: any
  value: string
}

export const Prelude = (props: Props) => {
  const [isOpen, setOpen] = React.useState(false)
  return (
    <Details>
      <Summary onClick={() => setOpen(current => !current)}>
        {isOpen ? 'hide prelude' : 'show prelude'}
      </Summary>
      <StyledCodeMirrorMode mode={props.mode}>
        {props.value}
      </StyledCodeMirrorMode>
    </Details>
  )
}
