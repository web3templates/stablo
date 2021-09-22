import * as React from 'react'
import {Observable, timer} from 'rxjs'
import {map, startWith} from 'rxjs/operators'
import {createEventHandler} from '../../createEventHandler'
import {WithObservable} from '../../WithObservable'

const justNumbers$ = timer(0, 500)

const numberReactElement$ = justNumbers$.pipe(map(num => <div>The number is {num}</div>))

const [onSpeedChange$, onSpeedChange] = createEventHandler<
  React.SyntheticEvent<HTMLInputElement>
>()

const speed$: Observable<number> = onSpeedChange$.pipe(
  map(event => Number(event.currentTarget.value)),
  startWith(1000)
)

export const WithObservableExample = () => (
  <>
    <h2>An observable of react elements</h2>
    <WithObservable observable={numberReactElement$} />
    <h2>An observable with child as render func</h2>
    <WithObservable observable={justNumbers$}>{num => <>The number is {num}</>}</WithObservable>

    <h2>Nested</h2>
    <p>You can adjust the update speed by changing update interval below</p>
    <WithObservable observable={speed$}>
      {(speed: number) => (
        <>
          Update interval:
          <input type="number" value={speed} onChange={onSpeedChange} step={200} min={0} />
          <WithObservable observable={timer(0, speed).pipe(map(n => <div>Update {n}</div>))} />
        </>
      )}
    </WithObservable>
  </>
)
