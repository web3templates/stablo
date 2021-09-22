/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:no-unused-expression*/

import { marbles } from "rxjs-marbles";
import { takeWhileInclusive } from "./takeWhileInclusive";

// prettier-ignore
describe("takeWhileInclusive", () => {
  it(
    "should take the value that fails the predicate",
    marbles(m => {
      const source = m.cold("   -a-b-c-d-|");
      const subs = "            ^----!";
      const expected = m.cold(" -a-b-(c|)");

      const destination = source.pipe(
        takeWhileInclusive(value => value !== "c")
      );
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(subs);
    })
  );

  it(
    "should take only the value that fails the predicate",
    marbles(m => {
      const source = m.cold("   -a-b-(cd)-|");
      const subs = "            ^----!";
      const expected = m.cold(" -a-b-(c|)");

      const destination = source.pipe(
        takeWhileInclusive(value => value !== "c")
      );
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(subs);
    })
  );

  it(
    "should support hot sources",
    marbles(m => {
      const source = m.hot("    -a-b-c-d-|");
      const subs = "            ^----!";
      const expected = m.cold(" -a-b-(c|)");

      const destination = source.pipe(
        takeWhileInclusive(value => value !== "c")
      );
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(subs);
    })
  );

  it(
    "should support sources that don't emit",
    marbles(m => {
      const source = m.cold("   -----|");
      const subs = "            ^----!";
      const expected = m.cold(" -----|");

      const destination = source.pipe(
        takeWhileInclusive(value => value !== "c")
      );
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(subs);
    })
  );

  it(
    "should support sources that complete before a value fails the predicate",
    marbles(m => {
      const source = m.cold("   -a-b-|");
      const subs = "            ^----!";
      const expected = m.cold(" -a-b-|");

      const destination = source.pipe(
        takeWhileInclusive(value => value !== "c")
      );
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(subs);
    })
  );
});
