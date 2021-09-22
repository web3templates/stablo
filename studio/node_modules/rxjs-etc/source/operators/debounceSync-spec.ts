/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:no-unused-expression rxjs-no-ignored-subscription*/

import { marbles } from "rxjs-marbles";
import { debounceSync } from "./debounceSync";

describe("debounceSync", () => {
  it(
    "should debounce synchronous values",
    marbles((m) => {
      const source = m.cold("   (ab)-(cd)---(ef)----|");
      const sourceSubs = "      ^-------------------!";
      const expected = m.cold(" b----d------f-------|");

      const destination = source.pipe(debounceSync());
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(sourceSubs);
    })
  );

  it(
    "should debounce values with synchronous completion",
    marbles((m) => {
      const source = m.cold("   (ab)-(cd)---(ef|)");
      const sourceSubs = "      ^-----------!";
      const expected = m.cold(" b----d------(f|)");

      const destination = source.pipe(debounceSync());
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(sourceSubs);
    })
  );

  it(
    "should debounce synchronous streams",
    marbles((m) => {
      const source = m.cold("   (abcdef|)");
      const sourceSubs = "      (^!)";
      const expected = m.cold(" (f|)");

      const destination = source.pipe(debounceSync());
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(sourceSubs);
    })
  );
});
