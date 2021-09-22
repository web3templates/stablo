/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:no-unused-expression*/

import { marbles } from "rxjs-marbles";
import { debounceAfter } from "./debounceAfter";

// prettier-ignore
describe("debounceAfter", () => {
  it(
    "should debounce after the notifier emits",
    marbles(m => {
      const source = m.cold("   ab-cd---ef------gh--|");
      const sourceSubs = "      ^-------------------!";
      const notifier = m.cold(" --n----n--n---------|");
      const notifierSubs = "    ^-------------------!";
      const expected = m.cold(" ab----d-------f-gh--|");

      const duration = m.time("----|");
      const destination = source.pipe(
        debounceAfter(notifier, duration, m.scheduler)
      );
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(sourceSubs);
      m.expect(notifier).toHaveSubscriptions(notifierSubs);
    })
  );
});
