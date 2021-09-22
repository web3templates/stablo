/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:no-unused-expression*/

import { marbles } from "rxjs-marbles";
import { unsubscribeOn } from "./unsubscribeOn";

// prettier-ignore
describe("unsubscribeOn", () => {
  it(
    "should unsubscribe on the specified scheduler",
    marbles(m => {
      const source = m.cold(" --a----");
      const sourceSubs = "    ^---!";
      const subs = "          ^---!";
      const expected = "      --a--";

      const destination = source.pipe(unsubscribeOn(m.scheduler));
      m.expect(destination, subs).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(sourceSubs);
    })
  );

  it(
    "should unsubscribe after the specifed delay",
    marbles(m => {
      const source = m.cold(" --a----");
      const sourceSubs = "    ^-----!";
      const subs = "          ^---!";
      const expected = "      --a--";

      const delay = m.time("--|");
      const destination = source.pipe(unsubscribeOn(m.scheduler, delay));
      m.expect(destination, subs).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(sourceSubs);
    })
  );
});
