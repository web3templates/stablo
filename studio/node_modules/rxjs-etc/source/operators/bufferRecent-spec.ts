/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:no-unused-expression*/

import { marbles } from "rxjs-marbles";
import { bufferRecent } from "./bufferRecent";

// prettier-ignore
describe("bufferRecent", () => {
  it(
    "should support a count of zero",
    marbles(m => {
      const source = m.hot("   abc");
      const expected = m.hot(" rrr", { r: [] });

      const result = source.pipe(bufferRecent(0));
      m.expect(result).toBeObservable(expected);
    })
  );

  it(
    "should support a count of one",
    marbles(m => {
      const source = m.hot("   abc");
      const expected = m.hot(" rst", { r: ["a"], s: ["b"], t: ["c"] });

      const result = source.pipe(bufferRecent(1));
      m.expect(result).toBeObservable(expected);
    })
  );

  it(
    "should support a count above one",
    marbles(m => {
      const source = m.hot("   abc");
      const expected = m.hot(" rst", { r: ["a"], s: ["a", "b"], t: ["b", "c"] });

      const result = source.pipe(bufferRecent(2));
      m.expect(result).toBeObservable(expected);
    })
  );
});
