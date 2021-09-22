/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:no-unused-expression*/

import { marbles } from "rxjs-marbles";
import { concatIfEmpty } from "./concatIfEmpty";

// prettier-ignore
describe("concatIfEmpty", () => {
  it(
    "should return the source if not empty",
    marbles(m => {
      const source = m.cold("   --a--b--c--|");
      const subs = "            ^----------!";
      const def = m.cold("      --d--|");
      const expected = m.cold(" --a--b--c--|");

      const destination = source.pipe(concatIfEmpty(def));
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(subs);
      m.expect(def).toHaveSubscriptions([]);
    })
  );

  it(
    "should return the default if empty",
    marbles(m => {
      const source = m.cold("   ----|");
      const sourceSubs = "      ^---!";
      const def = m.cold("      --d--|");
      const defSubs = "         ----^----!";
      const expected = m.cold(" ------d--|");

      const destination = source.pipe(concatIfEmpty(def));
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(sourceSubs);
      m.expect(def).toHaveSubscriptions(defSubs);
    })
  );
});
