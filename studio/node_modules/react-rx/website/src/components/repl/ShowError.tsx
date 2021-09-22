import * as React from 'react'
import styled from 'styled-components'

interface Props {
  title: string
  children: React.ReactNode
  className?: string
}

const Pre = styled.pre`
  color: rgb(255, 100, 100);
`

const Heading = styled.h2`
  padding: 3px:
  color: #fff
  padding: 8px;
`

export function ShowError(props: Props) {
  return (
    <div className={props.className}>
      <Heading>{props.title}</Heading>
      <Pre>{props.children}</Pre>
    </div>
  )
}
