import * as React from 'react'
import {Observable, of, timer} from 'rxjs'
import {ReactDOM, useMemoObservable} from '../../_utils/globalScope'
import {observableCallback} from 'observable-callback'
import {map, startWith, switchMap} from 'rxjs/operators'
//@endimport

const justNumbers$ = timer(0, 500)

const numberReactElement$ = justNumbers$.pipe(
  map((num) => <div>The number is {num}!</div>)
)

const [onSpeedChange$, onSpeedChange] = observableCallback<
  React.SyntheticEvent<HTMLInputElement>
>()

const speed$: Observable<number> = onSpeedChange$.pipe(
  map((event) => Number(event.currentTarget.value)),
  startWith(1000)
)

const UseObservableExample = () => (
  <>
    <h2>An observable of react elements</h2>
    {useMemoObservable(of(<div>HELLO SYNC</div>), [])}
    {useMemoObservable(numberReactElement$.pipe(startWith(2)), [])}
    <h2>An observable with child as render func</h2>
    {useMemoObservable(
      timer(0, 100).pipe(
        startWith(2),
        map((num) => <>The number is {num}</>)
      ),
      []
    )}

    <h2>Nested</h2>
    <p>You can adjust the update speed by changing update interval below</p>
    {useMemoObservable(
      () =>
        speed$.pipe(
          switchMap(
            (speed: number): Observable<[number, number]> =>
              timer(0, speed).pipe(
                map((update): [number, number] => [speed, update])
              )
          ),
          map(([speed, update]: [number, number]) => (
            <>
              Update interval:
              <input
                type="number"
                value={speed}
                onChange={onSpeedChange}
                step={200}
                min={0}
              />
              <div>Update {update}</div>
            </>
          ))
        ),
      []
    )}
  </>
)

ReactDOM.render(
  <UseObservableExample />,
  document.getElementById('use-observable-example')
)
