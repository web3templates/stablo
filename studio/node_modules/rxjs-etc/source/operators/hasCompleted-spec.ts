/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:no-unused-expression*/

import { marbles } from "rxjs-marbles";
import { hasCompleted } from "./hasCompleted";

// prettier-ignore
describe("hasCompleted", () => {
  it(
    "should emit nothing for a source that does not complete",
    marbles(m => {
      const source = m.cold(" ab-cd-ef--");
      const sourceSubs = "    ^---------";
      const expected = "      ----------";

      const destination = source.pipe(hasCompleted());
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(sourceSubs);
    })
  );

  it(
    "should emit 'true' when a source completes",
    marbles(m => {
      const source = m.cold("   ab-cd-ef-|");
      const sourceSubs = "      ^--------!";
      const expected = m.cold(" ---------(t|)", { t: true });

      const destination = source.pipe(hasCompleted());
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(sourceSubs);
    })
  );
});
