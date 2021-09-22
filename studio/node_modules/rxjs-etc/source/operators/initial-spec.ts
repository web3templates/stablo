/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:no-unused-expression*/

import { pipe } from "rxjs";
import { marbles } from "rxjs-marbles";
import { delay, mapTo } from "rxjs/operators";
import { initial } from "./initial";

// prettier-ignore
describe("initial", () => {
  it(
    "should debounce only initial notifications",
    marbles(m => {
      const source = m.cold("   abc---d|");
      const sourceSubs = "      ^------!";
      const expected = m.cold(" -bca--d|");

      const duration = m.time("---|");
      const destination = source.pipe(initial(delay(duration, m.scheduler)));
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(sourceSubs);
    })
  );

  it(
    "should support count",
    marbles(m => {
      const source = m.cold("   abc---d|");
      const sourceSubs = "      ^------!";
      const expected = m.cold(" --cab-d|");

      const duration = m.time("---|");
      const destination = source.pipe(initial(2, delay(duration, m.scheduler)));
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(sourceSubs);
    })
  );

  it(
    "should support a piped operator",
    marbles(m => {
      const source = m.cold("   abc---d|");
      const sourceSubs = "      ^------!";
      const expected = m.cold(" -bcx--d|");

      const duration = m.time("---|");
      const destination = source.pipe(
        initial(
          pipe(
            delay(duration, m.scheduler),
            mapTo("x")
          )
        )
      );
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(sourceSubs);
    })
  );
});
