/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:no-unused-expression*/

import { marbles } from "rxjs-marbles";
import { debounceTimeWithinReason } from "./debounceTimeWithinReason";

// prettier-ignore
describe("debounceTimeWithinReason", () => {
  it(
    "should debounce a source",
    marbles(m => {
      const source = m.cold(" ab-cd---ef----|");
      const sourceSubs = "    ^-------------!";
      const expected = "      -------d----f-|";

      const short = m.time("  ---|");
      const long = m.time("   -------|");
      const destination = source.pipe(
        debounceTimeWithinReason(short, long, m.scheduler)
      );
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(sourceSubs);
    })
  );

  it(
    "should emit during a series of values, each within the debounce duration",
    marbles(m => {
      const source = m.cold(" abcdefghijkl|");
      const sourceSubs = "    ^-----------!";
      const expected = "      ----d---i---(l|)";

      const short = m.time("  --|");
      const long = m.time("   ----|");
      const destination = source.pipe(
        debounceTimeWithinReason(short, long, m.scheduler)
      );
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(sourceSubs);
    })
  );
});
