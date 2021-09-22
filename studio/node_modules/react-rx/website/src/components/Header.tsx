import {Link} from './Link'
import * as React from 'react'
import styled from 'styled-components'
import {rxComponent} from 'react-rx'
import {pages} from '../pages/pages'

import {map} from 'rxjs/operators'
import {GithubLogo} from './logos/Github'
import {COLORS} from '../theme'
import {ReactRxLogo} from './logos/ReactRxLogo'
import {pageTransition$} from '../datastores/pageTransition'
import {omit} from 'lodash'

const StyledHeader = styled.header`
  z-index: 2000;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding-bottom: 0;
  background: ${COLORS.header.background};
  a,
  a:link,
  a:visited {
    color: ${COLORS.header.text};
  }
`

const HeaderInner = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 5em;
  padding: 0.5em 1em 0.5em 1em;
  background-color: ${COLORS.header.background};
`

const LinkWrapper = styled.div`
  color: #efefef;
  padding: 0.5em 1.2em 0.5em 0;
`

const omitProps = <T extends React.ComponentType>(
  Component: T,
  omitProps: string[]
) => (props: React.ComponentProps<T>) => {
  const omitted: any = omit(props, omitProps)
  return <Component {...omitted} />
}

const PageLink = styled(omitProps(Link, ['isActive', 'isTransitioningTo']))<{
  isActive: boolean
  isTransitioningTo: boolean
}>`
  display: block;
  color: ${COLORS.text};
  font-size: 1em;
  &:link,
  &:visited {
    color: ${COLORS.text};
    text-decoration: ${(props) =>
      (props.isActive || props.isTransitioningTo) && `underline`};
    text-decoration-style: ${(props) => props.isTransitioningTo && `wavy`};
  }
`

const LogoWrapper = styled.div`
  font-family: Roboto, 'Helvetica Neue Light', 'Helvetica Neue', Helvetica,
    Arial, 'Lucida Grande', sans-serif;
  -webkit-font-smoothing: antialiased;
  font-weight: bold;
  font-size: 1.3em;
  display: flex;
  flex-grow: 1;
  align-items: center;
`
const Logo = () => (
  <LogoWrapper>
    <Link href="/">
      <ReactRxLogo size="2em" style={{paddingRight: '0.4em'}} />
      ReactRx
    </Link>
  </LogoWrapper>
)

export const Header = rxComponent((page$) =>
  pageTransition$.pipe(
    map((transitionState) => (
      <StyledHeader>
        <HeaderInner>
          <Logo />
          {pages
            .filter((page) => page.id !== 'home')
            .map((page) => {
              return (
                <LinkWrapper key={page.id}>
                  <PageLink
                    href={page.route}
                    isTransitioningTo={
                      transitionState.isTransitioning &&
                      transitionState.next === page
                    }
                    isActive={transitionState.current === page}
                  >
                    {page.title}
                  </PageLink>
                </LinkWrapper>
              )
            })}
          <a href="https://github.com/sanity-io/react-rx">
            <GithubLogo style={{color: '#fff'}} height="25" width="25" />
          </a>
        </HeaderInner>
      </StyledHeader>
    ))
  )
)
