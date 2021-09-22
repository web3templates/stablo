/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:no-unused-expression*/

import { of } from "rxjs";
import { marbles } from "rxjs-marbles";
import { continueWith } from "./continueWith";

// prettier-ignore
describe("continueWith", () => {
  it(
    "should continue with the latest emitted value",
    marbles(m => {
      const source = m.cold(" abc|");
      const expected = "      abc(c|)";

      const result = source.pipe(continueWith((x) => of(x)));
      m.expect(result).toBeObservable(expected);
    })
  );

  it(
    "should not continue if the source has not emitted",
    marbles(m => {
      const source = m.cold(" ---|");
      const expected = "      ---|";

      const result = source.pipe(continueWith((x) => of(x)));
      m.expect(result).toBeObservable(expected);
    })
  );

  it(
    "should not continue if the mapped observable is EMPTY",
    marbles(m => {
      const source = m.cold(" abc|");
      const expected = "      abc|";

      const result = source.pipe(continueWith(() => []));
      m.expect(result).toBeObservable(expected);
    })
  );
});
