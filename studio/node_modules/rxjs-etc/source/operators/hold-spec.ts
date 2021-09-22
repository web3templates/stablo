/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:no-unused-expression*/

import { marbles } from "rxjs-marbles";
import { hold } from "./hold";

// prettier-ignore
describe("hold", () => {
  it(
    "should hold notifications until released",
    marbles(m => {
      const source = m.cold("   ab---cd-----|");
      const notifier = m.cold(" --z----z-----");
      const expected = "        --(ab)-(cd)-|";

      const destination = source.pipe(hold(notifier));
      m.expect(destination).toBeObservable(expected);
    })
  );
});
