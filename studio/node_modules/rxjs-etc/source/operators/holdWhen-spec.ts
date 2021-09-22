/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:no-unused-expression*/

import { marbles } from "rxjs-marbles";
import { holdWhen } from "./holdWhen";

// prettier-ignore
describe("holdWhen", () => {
  it(
    "should hold notifications until released",
    marbles(m => {
      const source = m.cold("   ab---cd--------|");
      const notifier = m.cold(" -----z");
      const expected = "        -----(ab)-(cd)-|";

      const destination = source.pipe(holdWhen(() => notifier));
      m.expect(destination).toBeObservable(expected);
    })
  );
});
