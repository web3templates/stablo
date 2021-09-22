/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:no-unused-expression*/

import { marbles } from "rxjs-marbles";
import { holdToggle } from "./holdToggle";

// prettier-ignore
describe("holdToggle", () => {
  it(
    "should hold using captures and releases",
    marbles(m => {
      const e1 = m.hot(" ---a---b---c---d---e---f---g---|");
      const e2 = m.hot(" --o------------------o---------|");
      const e3 = m.hot(" ---------c---------------c-----|");
      const expected = " ---------(ab)------------(f)---|";

      const destination = e1.pipe(holdToggle(e2, () => e3));
      m.expect(destination).toBeObservable(expected);
    })
  );
});
