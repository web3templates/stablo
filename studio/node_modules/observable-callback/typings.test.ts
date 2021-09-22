import {observableCallback} from "./observableCallback"
import {map, tap} from "rxjs/operators"

test("void args", () => {
  const [args$, cb] = observableCallback()

  cb()

  //@ts-expect-error (explicit void)
  cb(undefined)

  //@ts-expect-error (invalid argument)
  cb(123)

  args$.pipe(tap((arg: void) => {}))

  //@ts-expect-error (invalid argument type)
  args$.pipe(tap((arg: string) => {}))
})

test("explicit void", () => {
  const [args$, cb] = observableCallback<void>()

  // ok since type is explicit
  cb(undefined)

  args$.pipe(map((arg: void) => "ok"))

  //@ts-expect-error (invalid argument type)
  args$.pipe(map((arg: string) => "ok"))
})

test("type param", () => {
  const [args$, cb] = observableCallback<1>()
  cb(1)

  // @ts-expect-error
  cb(2)

  args$.pipe(tap((value: 1) => {}))

  // @ts-expect-error
  args$.pipe(tap((value: 2) => {}))
})

test("inferring source and target type from operator function", () => {
  const [args$, cb] = observableCallback(map((value: 1): "foo" => "foo"))
  cb(1)

  // @ts-expect-error
  cb(2)

  args$.pipe(tap((value: "foo") => {}))

  // @ts-expect-error
  args$.pipe(tap((value: 2) => {}))
})
