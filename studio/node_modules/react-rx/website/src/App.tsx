import * as React from 'react'
import {createGlobalStyle} from 'styled-components'
import {rxComponent} from 'react-rx'
import {map} from 'rxjs/operators'
import {COLORS, media} from './theme'
import {pageTransition$} from './datastores/pageTransition'

const GlobalStyle = createGlobalStyle`
  body {
    ${media.between('xsmall', 'small')} {
      font-size: 12px;
    }
    ${media.between('small', 'medium')} {
      font-size: 14px;
    }
    ${media.greaterThan('medium')} {
      font-size: 16px;
    }
    ${media.greaterThan('large')} {
      font-size: 18px;
    }
    padding: 0;
    margin: 0;
    background: ${COLORS.background};
    color: ${COLORS.text};
    font-family: Inter, -apple-system, system-ui, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
    'Droid Sans', 'Helvetica Neue', 'Fira Sans', system-ui, sans-serif;
    font-size: 1.125rem;
    overflow-y: scroll;
  }

  h1::before, h2::before, h3::before, h4::before {
    display: block;
    content: " ";
    visibility: hidden;
    pointer-events: none;
  }
  h2::before, h3::before, h4::before {
    margin-top:  -6em;
    height: 6em;
  }
  h1::before {
    margin-top:  -6em;
    height: 6em;
  }
  a:link,
  a:visited {
    color: ${COLORS.link};
    text-decoration: none;
  }
`

export const App = rxComponent(
  pageTransition$.pipe(
    map((transition) => {
      return (
        <>
          <GlobalStyle />
          {transition.component ? (
            <transition.component />
          ) : (
            <div>Loading…</div>
          )}
        </>
      )
    })
  )
)
