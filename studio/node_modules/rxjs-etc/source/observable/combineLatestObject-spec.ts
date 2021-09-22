/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:no-unused-expression*/

import { marbles } from "rxjs-marbles";
import { combineLatestObject } from "./combineLatestObject";

// prettier-ignore
describe("combineLatestObject", () => {
  it(
    "should support empty objects",
    marbles(m => {
      const expected = m.cold("(i|)", { i: {} });
      const destination = combineLatestObject({});
      m.expect(destination).toBeObservable(expected);
    })
  );

  it(
    "should support objects with single property",
    marbles(m => {
      const a = m.hot("         --a");
      const expected = m.cold(" --i", { i: { a: "a" } });
      const destination = combineLatestObject({ a });
      m.expect(destination).toBeObservable(expected);
    })
  );

  it(
    "should support objects with multiple properties",
    marbles(m => {
      const a = m.hot("         --a");
      const b = m.hot("         ---b");
      const expected = m.cold(" ---i", { i: { a: "a", b: "b" } });
      const destination = combineLatestObject({ a, b });
      m.expect(destination).toBeObservable(expected);
    })
  );

  it(
    "should support objects with non-observable properties",
    marbles(m => {
      const expected = m.cold("(i|)", { i: { a: "a" } });
      const destination = combineLatestObject({ a: "a" });
      m.expect(destination).toBeObservable(expected);
    })
  );

  it(
    "should support objects with some non-observable properties",
    marbles(m => {
      const a = m.hot("         --a");
      const expected = m.cold(" --i", { i: { a: "a", b: "b" } });
      const destination = combineLatestObject({ a, b: "b" });
      m.expect(destination).toBeObservable(expected);
    })
  );
});
