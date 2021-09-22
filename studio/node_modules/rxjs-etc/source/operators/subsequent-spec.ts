/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:no-unused-expression*/

import { pipe } from "rxjs";
import { marbles } from "rxjs-marbles";
import { debounceTime, mapTo } from "rxjs/operators";
import { subsequent } from "./subsequent";

// prettier-ignore
describe("subsequent", () => {
  it(
    "should debounce only subsequent notifications",
    marbles(m => {
      const source = m.cold("   ab-cd---ef----|");
      const sourceSubs = "      ^-------------!";
      const expected = m.cold(" a------d----f-|");

      const duration = m.time("---|");
      const destination = source.pipe(
        subsequent(debounceTime(duration, m.scheduler))
      );
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(sourceSubs);
    })
  );

  it(
    "should support count",
    marbles(m => {
      const source = m.cold("   ab-cd---ef----|");
      const sourceSubs = "      ^-------------!";
      const expected = m.cold(" ab-----d----f-|");

      const duration = m.time("---|");
      const destination = source.pipe(
        subsequent(2, debounceTime(duration, m.scheduler))
      );
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(sourceSubs);
    })
  );

  it(
    "should support a piped operator",
    marbles(m => {
      const source = m.cold("   ab-cd---ef----|");
      const sourceSubs = "      ^-------------!";
      const expected = m.cold(" a------x----x-|");

      const duration = m.time("---|");
      const destination = source.pipe(
        subsequent(
          pipe(
            debounceTime(duration, m.scheduler),
            mapTo("x")
          )
        )
      );
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(sourceSubs);
    })
  );
});
