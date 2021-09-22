import * as React from 'react'
import {Observable} from 'rxjs'
import {distinctUntilChanged, map, switchMap} from 'rxjs/operators'
import {streamingComponent} from './streamingComponent'

interface Props<T> {
  observable: Observable<T>
  children?: (value: T) => React.ReactElement<any>
}

type ObservableComponent<T> = React.ComponentType<Props<T>>

function id<T>(val: T): T {
  return val
}

// something is a bit off with the TS typings here
function createWithObservable<T>(): ObservableComponent<T> {
  return streamingComponent<Props<T>>(props$ =>
    props$.pipe(
      distinctUntilChanged((props, prevProps) => props.observable === prevProps.observable),
      switchMap(props =>
        props.observable.pipe(
          map(
            observableValue =>
              props.children
                ? props.children(observableValue)
                : id(observableValue)
          )
        )
      )
    )
  )
}

export const WithObservable = createWithObservable()
