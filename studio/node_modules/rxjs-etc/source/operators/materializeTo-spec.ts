/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:no-unused-expression*/

import { marbles } from "rxjs-marbles";
import { materializeTo } from "./materializeTo";

// prettier-ignore
describe("materializeTo", () => {
  it(
    "should complete the outer observable",
    marbles(m => {
      const outer = m.cold(" ---a----");
      const inner = m.cold("    ---x|");
      const expected = "     ------x|";

      const result = outer.pipe(materializeTo(inner));
      m.expect(result).toBeObservable(expected);
    })
  );
});
