import styled from 'styled-components'
import {COLORS, media} from '../theme'
import * as React from 'react'
import Burger from 'react-css-burger'

const SidebarContentInner = styled.div`
  ${media.greaterThan('large')} {
    position: fixed;
  }
  > ul {
    overflow-y: auto;
    bottom: 2em;
    height: calc(100vh - 18em);
  }
  ul {
    padding: 0 0 0 0.5em;
    li {
      padding: 0.3em 0;
      list-style: none;
      a,
      a:link,
      a:visited {
        color: ${COLORS.link};
      }
      a.selected {
        border-bottom: 3px solid ${COLORS.secondary};
      }
    }
  }
`

const SidebarWrapper = styled.div<{isOpen: boolean}>`
  ${media.lessThan('large')} {
    position: fixed;
    left: 0;
    padding: 0;
    z-index: 2000;
    top: 4.8em;
  }
  ${media.greaterThan('large')} {
    button {
      display: none;
    }
  }
  ${media.lessThan('large')} {
    border-radius: 0 0.5em 0.5em 0;
    box-shadow: ${props =>
      props.isOpen ? `0 4px 10px 0 ${COLORS.shadow}` : '0'};
    background-color: ${props =>
      props.isOpen ? '#eff0f3' : COLORS.header.background};
  }
`
const SidebarContent = styled.div<{isOpen: boolean}>`
  padding: 2em 0 0 1em;
  width: 250px;
  max-height: calc(100vh - 12em);

  ${media.lessThan('large')} {
    display: ${(props: any) => (props.isOpen ? '' : 'none')};
  }
  ${media.greaterThan('large')} {
    width: 230px;
  }
`

export const Sidebar = (props: {
  heading: string
  children: React.ReactNode
}) => {
  const [isOpen, setOpen] = React.useState(false)
  return (
    <SidebarWrapper isOpen={isOpen}>
      <Burger
        scale={0.6}
        active={isOpen}
        marginLeft="0"
        marginTop="0"
        onClick={() => setOpen(isOpen => !isOpen)}
      />
      <SidebarContent onClick={e => setOpen(false)} isOpen={isOpen}>
        <SidebarContentInner>
          <h4>{props.heading}</h4>
          {props.children}
        </SidebarContentInner>
      </SidebarContent>
    </SidebarWrapper>
  )
}
