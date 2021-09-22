import {observableCallback} from "./observableCallback"
import {concat, of} from "rxjs"
import {map} from "rxjs/operators"

// const [keywords$, onInput] = observableCallback(
//   pipe(
//     map((data: string) => data.split(" ")),
//     map((arr) => arr.map((kw) => kw.toUpperCase()))
//   )
// )

const [keywords$, onInput] = observableCallback((input$) =>
  concat<string>(of("initial value"), input$).pipe(
    map((data) => data.split(" ")),
    map((arr) => arr.map((kw) => kw.toUpperCase()))
  )
)

keywords$.subscribe(console.log)

onInput("foo bar baz")

setTimeout(() => {
  onInput("a b c d e")
}, 1000)
