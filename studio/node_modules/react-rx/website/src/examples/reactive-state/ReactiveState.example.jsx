import {
  map,
  React,
  ReactDOM,
  rxComponent,
  startWith,
  switchMap,
  timer,
  state
} from '../_utils/globalScope'
//@endimport

const ReactiveStateExample = rxComponent(() => {
  const [delay$, setDelay] = state(100)

  return delay$.pipe(
    switchMap(delay =>
      timer(500, delay).pipe(
        map(n => `Count: ${n}`),
        startWith('Starting counter…'),
        map(label => (
          <>
            Counter interval (ms):{' '}
            <input
              type="range"
              min={0}
              max={1000}
              step={100}
              onChange={e => setDelay(Number(e.currentTarget.value))}
            />
            {delay}
            <div>{label}</div>
          </>
        ))
      )
    )
  )
})

ReactDOM.render(
  <ReactiveStateExample />,
  document.getElementById('use-state-example')
)
