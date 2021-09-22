/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:no-unused-expression*/

import { marbles } from "rxjs-marbles";
import { forkJoinObject } from "./forkJoinObject";

// prettier-ignore
describe("forkJoinObject", () => {
  it(
    "should support empty objects",
    marbles(m => {
      const expected = m.cold("(i|)", { i: {} });
      const destination = forkJoinObject({});
      m.expect(destination).toBeObservable(expected);
    })
  );

  it(
    "should support objects with single property",
    marbles(m => {
      const a = m.hot("         --abc|");
      const expected = m.cold(" -----(i|)", { i: { a: "c" } });

      const destination = forkJoinObject({ a });
      m.expect(destination).toBeObservable(expected);
    })
  );

  it(
    "should support objects with multiple properties",
    marbles(m => {
      const a = m.hot("         --abc|");
      const x = m.hot("         ---xyz|");
      const expected = m.cold(" ------(i|)", { i: { a: "c", x: "z" } });
      const destination = forkJoinObject({ a, x });
      m.expect(destination).toBeObservable(expected);
    })
  );

  it(
    "should support objects with non-observable properties",
    marbles(m => {
      const expected = m.cold("(i|)", { i: { a: "a" } });
      const destination = forkJoinObject({ a: "a" });
      m.expect(destination).toBeObservable(expected);
    })
  );

  it(
    "should support objects with some non-observable properties",
    marbles(m => {
      const a = m.hot("         --abc|");
      const expected = m.cold(" -----(i|)", { i: { a: "c", b: "b" } });
      const destination = forkJoinObject({ a, b: "b" });
      m.expect(destination).toBeObservable(expected);
    })
  );
});
