/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:no-unused-expression*/

import { from, pipe } from "rxjs";
import { marbles } from "rxjs-marbles";
import { delay, mapTo, tap } from "rxjs/operators";
import { handler } from "./handler";

// prettier-ignore
describe("handler", () => {
  it(
    "should be emit the called value",
    marbles(m => {
      const source = m.cold(" -a-b--|");
      const expected = "      -a-b--|";
      const handled = "       -a-b---";

      const h = handler<string>();
      const destination = source.pipe(tap(h));

      m.expect(destination).toBeObservable(expected);
      m.expect(from(h)).toBeObservable(handled);
    })
  );

  it(
    "should support a single operator",
    marbles(m => {
      const source = m.cold(" -a-b--|");
      const expected = "      -a-b--|";
      const handled = "       -x-x---";

      const h = handler(mapTo("x"));
      const destination = source.pipe(tap(h));

      m.expect(destination).toBeObservable(expected);
      m.expect(from(h)).toBeObservable(handled);
    })
  );

  it(
    "should support mulitple, piped operators",
    marbles(m => {
      const source = m.cold(" -a-b--|");
      const expected = "      -a-b--|";
      const handled = "       --x-x--";

      const h = handler(
        pipe(
          mapTo("x"),
          delay(m.time("-|"), m.scheduler)
        )
      );
      const destination = source.pipe(tap(h));

      m.expect(destination).toBeObservable(expected);
      m.expect(from(h)).toBeObservable(handled);
    })
  );
});
