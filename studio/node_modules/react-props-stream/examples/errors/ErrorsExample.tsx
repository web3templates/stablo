import * as React from 'react'
import {timer} from 'rxjs'
import {catchError, map, mergeMapTo, startWith, tap} from 'rxjs/operators'
import {createEventHandler} from '../../createEventHandler'
import {withPropsStream} from '../../withPropsStream'

const numbers$ = timer(0, 500).pipe(
  tap(() => {
    if (Math.random() > 0.9) {
      throw new Error('Stream failed')
    }
  })
)

const MyComponent = props => (
  <>
    <p>The observable stream will fail 1 in 10 times on average</p>

    {props.error ? (
      <>
        <p>Oh no: an error occurred: {props.error.message}</p>
        <p>
          <button onClick={props.onRetry}>Retry</button>
        </p>
      </>
    ) : (
      `Counter: ${props.number}`
    )}
  </>
)

export const ErrorsExample = withPropsStream(
  numbers$.pipe(
    map(n => ({number: n})),
    catchError((error, caught$) => {
      const [onRetry$, onRetry] = createEventHandler()
      return onRetry$.pipe(
        mergeMapTo(caught$),
        startWith({error, onRetry})
      )
    })
  ),
  MyComponent
)
