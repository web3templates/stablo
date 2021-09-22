/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:no-unused-expression*/

import { timer } from "rxjs";
import { marbles } from "rxjs-marbles";
import { deferFinalize } from "./deferFinalize";

// prettier-ignore
describe("deferFinalize", () => {
  it(
    "should support asynchonous finalization upon complete",
    marbles(m => {
      const duration = m.time("--|");

      const source = m.cold(" ---|");
      const sourceSub = "     ^----!";
      const expected = "      -----|";

      const result = source.pipe(deferFinalize(_ => timer(duration)));
      m.expect(result).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(sourceSub);
    })
  );

  it(
    "should support asynchonous finalization upon error",
    marbles(m => {
      const duration = m.time("--|");

      const source = m.cold(" ---#");
      const sourceSub = "     ^----!";
      const expected = "      -----#";

      const result = source.pipe(deferFinalize(_ => timer(duration)));
      m.expect(result).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(sourceSub);
    })
  );

  it(
    "should support asynchonous finalization upon unsubscribe",
    marbles(m => {
      const duration = m.time("--|");

      const source = m.cold(" ------");
      const sourceSub = "     ^----!";
      const expected = "      ----";
      const sub = "           ^--!";

      const result = source.pipe(deferFinalize(_ => timer(duration)));
      m.expect(result, sub).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(sourceSub);
    })
  );
});
