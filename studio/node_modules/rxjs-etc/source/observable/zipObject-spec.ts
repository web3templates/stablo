/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:no-unused-expression*/

import { marbles } from "rxjs-marbles";
import { zipObject } from "./zipObject";

describe("zipObject", () => {
  it(
    "should zip the Observable values of an object and mirror that object with the notification values",
    marbles((m) => {
      const a = m.hot("         --a");
      const b = m.hot("         ---b");
      const expected = m.cold(" ---i", { i: { a: "a", b: "b" } });
      const destination = zipObject({ a, b });
      m.expect(destination).toBeObservable(expected);
    })
  );

  it(
    "should support multiple notifications from the input observables",
    marbles((m) => {
      const a = m.hot("         --a-c");
      const b = m.hot("         ---b-d");
      const expected = m.cold(" ---i-j", {
        i: { a: "a", b: "b" },
        j: { a: "c", b: "d" },
      });
      const destination = zipObject({ a, b });
      m.expect(destination).toBeObservable(expected);
    })
  );

  it(
    "should support empty objects",
    marbles((m) => {
      const expected = m.cold("(i|)", { i: {} });
      const destination = zipObject({});
      m.expect(destination).toBeObservable(expected);
    })
  );

  it(
    "should support objects with single property",
    marbles((m) => {
      const a = m.hot("         --a");
      const expected = m.cold(" --i", { i: { a: "a" } });
      const destination = zipObject({ a });
      m.expect(destination).toBeObservable(expected);
    })
  );

  it(
    "should support objects with non-observable properties",
    marbles((m) => {
      const expected = m.cold("(i|)", { i: { a: "a" } });
      const destination = zipObject({ a: "a" });
      m.expect(destination).toBeObservable(expected);
    })
  );

  it(
    "should support objects with some non-observable properties",
    marbles((m) => {
      const a = m.hot("         --a");
      const expected = m.cold(" --(i|)", { i: { a: "a", b: "b" } });
      const destination = zipObject({ a, b: "b" });
      m.expect(destination).toBeObservable(expected);
    })
  );
});
