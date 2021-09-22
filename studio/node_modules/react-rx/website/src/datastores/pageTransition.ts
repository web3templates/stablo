import {
  map,
  publishReplay,
  refCount,
  scan,
  skip,
  switchMap,
  tap
} from 'rxjs/operators'
import {concat, from, Observable, of} from 'rxjs'
import * as React from 'react'
import {page$} from './page'
import {Page} from '../pages/pages'

interface PageTransition {
  title: string
  isTransitioning: boolean
  component: null | React.ComponentType<any>
}

interface TransitionStart {
  type: 'transitionStart'
  page: Page
  component: null
}

interface TransitionEnd {
  type: 'transitionEnd'
  page: Page
  component: React.ComponentType<any>
}

type TransitionEvent = TransitionStart | TransitionEnd

interface TransitionState {
  isTransitioning: boolean
  prev: null | Page
  current: null | Page
  next: null | Page
  component: null | React.ComponentType
}

const transitionStart = (page: Page): TransitionStart => ({
  type: 'transitionStart',
  page,
  component: null
})

const transitionEnd = (page: Page) => (
  component: React.ComponentType<any>
): TransitionEnd => ({
  type: 'transitionEnd',
  page,
  component
})

const INITIAL_TRANSITION_STATE: TransitionState = {
  isTransitioning: true,
  component: null,
  next: null,
  current: null,
  prev: null
}

export const pageTransition$: Observable<TransitionState> = page$.pipe(
  switchMap(page =>
    concat(
      of(transitionStart(page)),
      from(page.load()).pipe(map(transitionEnd(page)))
    )
  ),
  scan(
    (
      acc: TransitionState,
      event: TransitionStart | TransitionEnd
    ): TransitionState => {
      return event.type === 'transitionStart'
        ? {
            isTransitioning: true,
            component: acc.component,
            prev: acc.next || acc.current,
            current: acc.current || null,
            next: event.page
          }
        : {
            isTransitioning: false,
            component: event.component,
            current: acc.next,
            next: null,
            prev: acc.current
          }
    },
    INITIAL_TRANSITION_STATE
  ),
  publishReplay(1),
  refCount()
)
