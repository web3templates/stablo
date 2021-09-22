/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:no-unused-expression*/

import { marbles } from "rxjs-marbles";
import { filter, map } from "rxjs/operators";
import { spread } from "./spread";

// prettier-ignore
describe("spread", () => {
  it(
    "should pipe the specified operators",
    marbles(m => {
      const source = m.cold("   -a-b-c-|");
      const subs = "            ^------!";
      const expected = m.cold(" -A---C-|)");

      const operators = [
        filter(value => value !== "b"),
        map((value: string) => value.toUpperCase())
      ];
      const destination = source.pipe(spread(...operators));
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(subs);
    })
  );
});
