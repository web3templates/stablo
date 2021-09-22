import styled from 'styled-components'
import * as React from 'react'

export const Container = styled.div`
  margin-top: 7em;
  display: flex;
  flex-direction: row;
`

export const ContentWrapper = styled.div`
  width: 100%;
  margin: 0;
`

export const ContentInner = styled.div`
  padding: 0 1em;
`
export const Content = (props: {children: React.ReactNode}) => {
  return (
    <ContentWrapper>
      <ContentInner>{props.children}</ContentInner>
    </ContentWrapper>
  )
}
