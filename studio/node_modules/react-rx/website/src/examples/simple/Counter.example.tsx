import {
  map,
  React,
  ReactDOM,
  rxComponent,
  timer
} from '../_utils/globalScope'
//@endimport

const Counter = rxComponent(
  timer(0, 1000).pipe(map(seconds => <>Seconds: {seconds}</>))
)

ReactDOM.render(<Counter />, document.getElementById('counter-example'))
