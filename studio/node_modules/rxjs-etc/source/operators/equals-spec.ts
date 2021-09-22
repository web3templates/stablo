/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */

import { marbles } from "rxjs-marbles";
import { equals } from "./equals";

// prettier-ignore
describe("equals", () => {
  it(
    "should not filter values that are equla to the predicate",
    marbles(m => {
      const values = { a: 1, b: 1, c: 1 };

      const source = m.cold("   -a-b-c-|", values);
      const subs = "            ^------!";
      const expected = m.cold(" -a-b-c-|", values);

      const destination = source.pipe(
        equals(1)
      );
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(subs);
    })
  );

  it(
    "should filter values that are not equal to the predicate",
    marbles(m => {
      const values = { a: 2, b: 3, c: 4 };

      const source = m.cold("   -a-b-c-|", values);
      const subs = "            ^------!";
      const expected = m.cold(" -------|");

      const destination = source.pipe(
        equals(1)
      );
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(subs);
    })
  );
});
