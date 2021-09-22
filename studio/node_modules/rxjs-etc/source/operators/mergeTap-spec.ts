/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:no-unused-expression*/

import { marbles } from "rxjs-marbles";
import { mergeTap } from "./mergeTap";

// prettier-ignore
describe("mergeTap", () => {
  it(
    "should mirror the source",
    marbles(m => {
      const source = m.cold(" abc|");
      const next = m.cold("   (n|)");
      const expected = "      abc|";

      const result = source.pipe(mergeTap(() => next));
      m.expect(result).toBeObservable(expected);
    })
  );

  it(
    "should merge tapped observables",
    marbles(m => {
      const source = m.cold(" a--b--c|");
      const next = m.cold("   n---|");
      const expected = "      ----a--b--(c|)";

      const result = source.pipe(mergeTap(() => next));
      m.expect(result).toBeObservable(expected);
    })
  );
});
