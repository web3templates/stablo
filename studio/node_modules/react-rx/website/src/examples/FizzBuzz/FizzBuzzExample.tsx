import {
  map,
  React,
  ReactDOM,
  rxComponent,
  take,
  timer
} from '../_utils/globalScope'
//@endimport

const FizzBuzzExample = rxComponent(
  timer(0, 500).pipe(
    map(n => n + 1),
    map(n => {
      const divBy3 = n % 3 === 0
      const divBy5 = n % 5 === 0
      const divBy3And5 = divBy3 && divBy5
      return divBy3And5
        ? 'Fizz Buzz'
        : divBy3
        ? 'Fizz'
        : divBy5
        ? 'Buzz'
        : String(n)
    }),
    // map((seq: string[], curr) => seq.concat(curr), []),
    map((n, i) => (
      <div key={n + i}>
        {i + 1}: {n}
      </div>
    )),
    take(100)
  )
)

ReactDOM.render(
  <FizzBuzzExample />,
  document.getElementById('fizz-buzz-example')
)
