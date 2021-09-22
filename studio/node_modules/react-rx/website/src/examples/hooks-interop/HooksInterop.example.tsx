import {
  forwardRef,
  map,
  React,
  ReactDOM,
  rxComponent,
  useAsObservable
} from '../_utils/globalScope'
import {combineLatest, timer} from 'rxjs'
//@endimport

const ticks$ = timer(0, 1000)

function useClickCounter(): [number, () => void] {
  const [clickCount, setClickCount] = React.useState(0)
  const inc = React.useCallback(() => setClickCount((c) => c + 1), [])

  return [clickCount, inc]
}

const HooksInteropExample = rxComponent(() => {
  const [clickCount, inc] = useClickCounter()

  // This is required in order to turn clickCount into an observable value
  const click$ = useAsObservable(clickCount)

  return combineLatest([click$, ticks$]).pipe(
    map(([clickCount, tickNumber]) => (
      <>
        Tick: {tickNumber}
        <button onClick={inc}>
          This button has been clicked {clickCount} times
        </button>
      </>
    ))
  )
})

ReactDOM.render(
  <HooksInteropExample />,
  document.getElementById('forward-ref-example')
)
