import {observableCallback} from "./observableCallback"
import {map} from "rxjs/operators"

test("emits passed argument", () => {
  const [args$, cb] = observableCallback<string>()

  let receivedArg
  args$.subscribe((passedArg) => (receivedArg = passedArg))

  cb("foo")
  expect(receivedArg).toBe("foo")

  //@ts-expect-error
  cb("bar", "baz")
  expect(receivedArg).toBe("bar")
})

test("can take an operator function as argument", () => {
  const [args$, cb] = observableCallback(
    map((arg: string) => arg.toUpperCase())
  )

  let receivedArg
  args$.subscribe((passedArg) => (receivedArg = passedArg))

  cb("foo")
  expect(receivedArg).toBe("FOO")
})
