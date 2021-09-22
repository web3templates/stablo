/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:no-unused-expression*/

import { marbles } from "rxjs-marbles";
import { startWithDeferred } from "./startWithDeferred";

// prettier-ignore
describe("startWithDeferred", () => {
  it(
    "should start with the value returned by the factory",
    marbles(m => {
      const source = m.cold("   --a--b--c--|");
      const subs = "            ^----------!";
      const expected = m.cold(" x-a--b--c--|");

      const destination = source.pipe(startWithDeferred(() => "x"));
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(subs);
    })
  );
});
