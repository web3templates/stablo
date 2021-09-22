/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:no-unused-expression*/

import { Observable } from "rxjs";
import { marbles } from "rxjs-marbles";
import { pairwiseStartWith } from "./pairwiseStartWith";

// prettier-ignore
describe("pairwiseStartWith", () => {
  it(
    "should start with the specified value",
    marbles(m => {
      type T = [string | undefined, string];
      const source = m.cold("   abc") as Observable<string>;
      const expected = m.cold(" xyz", {
        x: [undefined, "a"] as T,
        y: ["a", "b"] as T,
        z: ["b", "c"] as T
      });

      const result = source.pipe(pairwiseStartWith(undefined));
      m.expect(result).toBeObservable(expected);
    })
  );
});
