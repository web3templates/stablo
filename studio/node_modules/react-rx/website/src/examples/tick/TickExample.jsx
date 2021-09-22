import {
  map,
  mapTo,
  React,
  ReactDOM,
  rxComponent,
  startWith,
  switchMap,
  timer
} from '../_utils/globalScope'
//@endimport

const {distinctUntilChanged, sampleTime} = operators

const Ticker = rxComponent(props$ =>
  props$.pipe(
    map(props => props.tick),
    distinctUntilChanged(),
    switchMap(tick => timer(300).pipe(mapTo(tick))),
    startWith(0),
    map(tick => `Delayed tick: ${tick}`)
  )
)

const TickerWithSubTick = rxComponent(props$ =>
  props$.pipe(
    map(props => props.tick),
    distinctUntilChanged(),
    switchMap(tick => timer(0, 10).pipe(map(subtick => ({tick, subtick})))),
    sampleTime(20),
    map(props => (
      <div>
        {props.tick}:{props.subtick}
      </div>
    ))
  )
)

const TickExample = rxComponent(
  timer(0, 1000).pipe(
    map(tick => (
      <>
        <div>Tick: {tick}</div>
        <Ticker tick={tick} />
        <TickerWithSubTick tick={tick} />
      </>
    ))
  )
)

ReactDOM.render(<TickExample />, document.getElementById('ticker-example'))
