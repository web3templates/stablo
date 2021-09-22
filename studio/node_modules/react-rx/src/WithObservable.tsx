import * as React from 'react'
import {Observable} from 'rxjs'
import {distinctUntilChanged, map, switchMap} from 'rxjs/operators'
import {reactiveComponent} from './reactiveComponent'
import {ComponentType, ReactNode} from 'react'

interface Props<T> {
  observable: Observable<T>
  children: (value: T) => ReactNode
}

type ObservableComponent<T> = ComponentType<Props<T>>

function createWithObservable<T>(): ObservableComponent<T> {
  return reactiveComponent((props$: Observable<Props<T>>) =>
    props$.pipe(
      distinctUntilChanged((props, prevProps) => props.observable === prevProps.observable),
      switchMap(
        (props): Observable<ReactNode> =>
          props.observable.pipe(map((observableValue: T) => props.children(observableValue))),
      ),
    ),
  )
}

/**
 * @deprecated Use the useObservable hook instead
 */
export const WithObservable = createWithObservable()
