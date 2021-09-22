/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:no-unused-expression*/

import { marbles } from "rxjs-marbles";
import { withLatestFromWhen } from "./withLatestFromWhen";

// prettier-ignore
describe("withLatestFromWhen", () => {
  it(
    "should flush the latest values when notified",
    marbles(m => {
      const a = m.cold("        --a--b-c--d");
      const i = m.cold("        i--j----k--");
      const x = m.cold("        -x--y----z-");
      const notifier = m.cold(" ------f----");
      const expected = m.cold(" --m--n----o", {
        m: ["a", "i", "x"],
        n: ["b", "j", "y"],
        o: ["d", "k", "z"]
      }) as any;

      const result = a.pipe(withLatestFromWhen(i, x, () => notifier));
      m.expect(result).toBeObservable(expected);
    })
  );
});
