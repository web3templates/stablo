/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:no-unused-expression*/

import { marbles } from "rxjs-marbles";
import { zipArray } from "./zipArray";

// prettier-ignore
describe("zipArray", () => {
  it(
    "should zip a single observable",
    marbles(m => {
      const values = { a: 1, b: 2 };
      const results = { x: [values.a], y: [values.b] };

      const source = m.cold("   a-b--|", values);
      const subs = "            ^----!";
      const expected = m.cold(" x-y--|", results);

      const destination = zipArray([source]);
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(subs);
    })
  );

  it(
    "should zip multiple observables",
    marbles(m => {
      const values = { a: 1, b: 2, c: 3 };
      const results = { x: [values.a, values.c] };

      const source1 = m.cold("  a-b--|", values);
      const source2 = m.cold("  -c---|", values);
      const subs = "            ^----!";
      const expected = m.cold(" -x---|", results);

      const destination = zipArray([source1, source2]);
      m.expect(destination).toBeObservable(expected);
      m.expect(source1).toHaveSubscriptions(subs);
      m.expect(source2).toHaveSubscriptions(subs);
    })
  );

  it(
    "should emit an empty array when observables is empty",
    marbles(m => {
      const expected = m.cold("(x|)", { x: [] });
      const destination = zipArray([]);
      m.expect(destination).toBeObservable(expected);
    })
  );

  it(
    "should support project for a single observable",
    marbles(m => {
      const values = { a: 1, b: 2 };
      const results = { x: [values.a + 1], y: [values.b + 1] };

      const source = m.cold("   a-b--|", values);
      const subs = "            ^----!";
      const expected = m.cold(" x-y--|", results);

      const destination = zipArray([source], values =>
        values.map(value => value + 1)
      );
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(subs);
    })
  );

  it(
    "should support project for multiple observables",
    marbles(m => {
      const values = { a: 1, b: 2, c: 3 };
      const results = { x: [values.a + 1, values.c + 1] };

      const source1 = m.cold("  a-b--|", values);
      const source2 = m.cold("  -c---|", values);
      const subs = "            ^----!";
      const expected = m.cold(" -x---|", results);

      const destination = zipArray([source1, source2], values =>
        values.map(value => value + 1)
      );
      m.expect(destination).toBeObservable(expected);
      m.expect(source1).toHaveSubscriptions(subs);
      m.expect(source2).toHaveSubscriptions(subs);
    })
  );

  it(
    "should support project when observables is empty",
    marbles(m => {
      const expected = m.cold("(x|)", { x: ["empty"] });
      const destination = zipArray([], values => ["empty"]);
      m.expect(destination).toBeObservable(expected);
    })
  );
});
