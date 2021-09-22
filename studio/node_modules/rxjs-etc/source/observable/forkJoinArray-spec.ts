/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:no-unused-expression*/

import { marbles } from "rxjs-marbles";
import { forkJoinArray } from "./forkJoinArray";

// prettier-ignore
describe("forkJoinArray", () => {
  it(
    "should join a single observable",
    marbles(m => {
      const values = { a: 1 };
      const results = { x: [values.a] };

      const source = m.cold("   a----|", values);
      const subs = "            ^----!";
      const expected = m.cold(" -----(x|)", results);

      const destination = forkJoinArray([source]);
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(subs);
    })
  );

  it(
    "should join multiple observables",
    marbles(m => {
      const values = { a: 1, b: 2 };
      const results = { x: [values.a, values.b] };

      const source1 = m.cold("  a--|", values);
      const subs1 = "           ^--!";
      const source2 = m.cold("  b----|", values);
      const subs2 = "           ^----!";
      const expected = m.cold(" -----(x|)", results);

      const destination = forkJoinArray([source1, source2]);
      m.expect(destination).toBeObservable(expected);
      m.expect(source1).toHaveSubscriptions(subs1);
      m.expect(source2).toHaveSubscriptions(subs2);
    })
  );

  it(
    "should emit an empty array when observables is empty",
    marbles(m => {
      const expected = m.cold("(x|)", { x: [] });
      const destination = forkJoinArray([]);
      m.expect(destination).toBeObservable(expected);
    })
  );

  it(
    "should support project for a single observable",
    marbles(m => {
      const values = { a: 1 };
      const results = { x: [values.a + 1] };

      const source = m.cold("   a----|", values);
      const subs = "            ^----!";
      const expected = m.cold(" -----(x|)", results);

      const destination = forkJoinArray([source], values =>
        values.map(value => value + 1)
      );
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(subs);
    })
  );

  it(
    "should support project for multiple observables",
    marbles(m => {
      const values = { a: 1, b: 2 };
      const results = { x: [values.a + 1, values.b + 1] };

      const source1 = m.cold("  a--|", values);
      const subs1 = "           ^--!";
      const source2 = m.cold("  b----|", values);
      const subs2 = "           ^----!";
      const expected = m.cold(" -----(x|)", results);

      const destination = forkJoinArray([source1, source2], values =>
        values.map(value => value + 1)
      );
      m.expect(destination).toBeObservable(expected);
      m.expect(source1).toHaveSubscriptions(subs1);
      m.expect(source2).toHaveSubscriptions(subs2);
    })
  );

  it(
    "should support project when observables is empty",
    marbles(m => {
      const expected = m.cold("(x|)", { x: ["empty"] });
      const destination = forkJoinArray([], values => ["empty"]);
      m.expect(destination).toBeObservable(expected);
    })
  );
});
