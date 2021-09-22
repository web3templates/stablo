/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:no-unused-expression*/

import { marbles } from "rxjs-marbles";
import { guard } from "./guard";

// prettier-ignore
describe("guard", () => {
  it(
    "should not reject values that pass the guard",
    marbles(m => {
      const values = { a: 1, b: 2, c: 3 };

      const source = m.cold("        -a-b-c-|", values);
      const subs = "                 ^------!";
      const expected = m.cold<any>(" -a-b-c-|", values);

      const destination = source.pipe(
        guard((value): value is number => typeof value === "number")
      );
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(subs);
    })
  );

  it(
    "should reject values that fail the guard",
    marbles(m => {
      const values = { a: 1, b: 2, c: "three" };

      const source = m.cold("        -a-b-c-|", values);
      const subs = "                 ^----!";
      const expected = m.cold<any>(" -a-b-#", values, new Error("Guard rejection."));

      const destination = source.pipe(
        guard((value): value is number => typeof value === "number")
      );
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(subs);
    })
  );

  it(
    "should support an error messge",
    marbles(m => {
      const values = { a: 1, b: 2, c: "three" };
      const message = "Not a number";

      const source = m.cold("        -a-b-c-|", values);
      const subs = "                 ^----!";
      const expected = m.cold<any>(" -a-b-#", values, new Error(message));

      const destination = source.pipe(
        guard((value): value is number => typeof value === "number", message)
      );
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(subs);
    })
  );
});
