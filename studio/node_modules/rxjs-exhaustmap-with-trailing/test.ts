import {TestScheduler} from "rxjs/testing"
import {delay} from "rxjs/operators"
import {exhaustMapWithTrailing, exhaustMapToWithTrailing} from "./"
import {of} from "rxjs"
import {RunHelpers} from "rxjs/internal/testing/TestScheduler"

describe("exhaustMapWithTrailing()", () => {
  it("is empty when source is empty", () => {
    runTest(({cold, expectObservable}) => {
      const [input, expected] = marble`
      |
      |
    `

      const result = cold(input).pipe(
        exhaustMapWithTrailing((d) => of(d).pipe(delay(4)))
      )

      expectObservable(result).toBe(expected)
    })
  })

  it("emits both leading and trailing ends", () => {
    runTest(({cold, expectObservable}) => {
      const [input, expected] = marble`
      ab-----|
      ----a---(b|)
    `

      const result = cold(input).pipe(
        exhaustMapWithTrailing((d) => of(d).pipe(delay(4)))
      )

      expectObservable(result).toBe(expected)
    })
  })

  it("does not emit trailing values after source has completed", () => {
    runTest(({cold, expectObservable}) => {
      const [input, expected] = marble`
      ab|
      ----(a|)
    `

      const result = cold(input).pipe(
        exhaustMapWithTrailing((d) => of(d).pipe(delay(4)))
      )

      expectObservable(result).toBe(expected)
    })
  })

  it("completes immediately if source ended while waiting for inner observable to complete", () => {
    runTest(({cold, expectObservable}) => {
      const [input, expected] = marble`
      a-|
      ---- (a|)
    `

      const result = cold(input).pipe(
        exhaustMapWithTrailing((d) => of(d).pipe(delay(4)))
      )

      expectObservable(result).toBe(expected)
    })
  })

  it("emits the trailing value if emitted in same frame as the current", () => {
    runTest(({cold, expectObservable}) => {
      const [input, expected] = marble`
      a-b-c-|
      ----a---(c|)
    `

      const result = cold(input).pipe(
        exhaustMapWithTrailing((d) => of(d).pipe(delay(4)))
      )

      expectObservable(result).toBe(expected)
    })
  })

  it("emits the trailing value if emitted after new value received", () => {
    runTest(({cold, expectObservable}) => {
      const [input, expected] = marble`
      a-b--c----|
      ----a---b---(c|)
    `

      const result = cold(input).pipe(
        exhaustMapWithTrailing((d) => of(d).pipe(delay(4)))
      )

      expectObservable(result).toBe(expected)
    })
  })

  it("waits for the source observable to complete", () => {
    runTest(({cold, expectObservable}) => {
      const [input, expected] = marble`
      a-b-c-----|
      ----a---c-|
    `

      const result = cold(input).pipe(
        exhaustMapWithTrailing((d) => of(d).pipe(delay(4)))
      )

      expectObservable(result).toBe(expected)
    })
  })

  it("forwards errors from source observable", () => {
    runTest(({cold, expectObservable}) => {
      const [input, expected] = marble`
      a-#
      --#
    `

      const result = cold(input).pipe(
        exhaustMapWithTrailing((d) => of(d).pipe(delay(4)))
      )

      expectObservable(result).toBe(expected)
    })
  })
})

describe("exhaustMapToWithTrailing()", () => {
  it("takes an observable as argument", () => {
    runTest(({cold, expectObservable}) => {
      const [input, expected] = marble`
      a-b-c-----|
      ----x---x-|
    `
      const result = cold(input).pipe(
        exhaustMapToWithTrailing(of("x").pipe(delay(4)))
      )
      expectObservable(result).toBe(expected)
    })
  })
})

function runTest(callback: (helpers: RunHelpers) => void) {
  return new TestScheduler((actual, expected) => {
    expect(actual).toEqual(expected)
  }).run(callback)
}

function marble(strings: TemplateStringsArray) {
  return strings.join("").split("\n").filter(Boolean)
}
