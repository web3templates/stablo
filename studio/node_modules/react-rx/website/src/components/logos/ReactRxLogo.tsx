import * as React from 'react'
import {CSSProperties} from 'react'
import {RxJSLogo} from './RxJs'
import styled from 'styled-components'
import {ReactLogo} from './React'

const StyledRxJSLogo = styled(RxJSLogo)`
  width: ${props => props.width};
  opacity: 0.7;
  position: absolute;
`
const StyledReactLogo = styled(ReactLogo)`
  width: ${props => props.width};
  opacity: 0.7;
  position: absolute;
`

export function ReactRxLogo(props: {
  className?: string
  style?: CSSProperties
  size: string
}) {
  return (
    <div
      className={props.className}
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        position: 'relative',
        width: props.size,
        height: props.size,
        ...props.style
      }}
    >
      <StyledReactLogo width={props.size} height={props.size} />
      <StyledRxJSLogo width={props.size} height={props.size} />
    </div>
  )
}
