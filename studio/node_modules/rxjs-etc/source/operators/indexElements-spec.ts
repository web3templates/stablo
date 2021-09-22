/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:no-unused-expression*/

import { marbles } from "rxjs-marbles";
import { indexElements } from "./indexElements";

// prettier-ignore
describe("indexElements", () => {
  it(
    "should index without a project function",
    marbles(m => {
      const source = m.cold("   ab-cd-");
      const sourceSubs = "      ^-----";
      const expected = m.cold(" ab-cd-", { a: 0, b: 1, c: 2, d: 3 });

      const destination = source.pipe(indexElements());
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(sourceSubs);
    })
  );

  it(
    "should index with a project function",
    marbles(m => {
      const source = m.cold("   ab-cd-");
      const sourceSubs = "      ^-----";
      const expected = m.cold(" ab-cd-", { a: "a:0", b: "b:1", c: "c:2", d: "d:3" });

      const destination = source.pipe(
        indexElements((value, index) => `${value}:${index}`)
      );
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(sourceSubs);
    })
  );
});
