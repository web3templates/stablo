/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:no-unused-expression*/

import { marbles } from "rxjs-marbles";
import { mergeMap } from "rxjs/operators";
import { expecter } from "ts-snippet";
import { compiler } from "../compiler-spec";
import { timeout } from "../timeout-spec";
import { splitBy } from "./splitBy";

describe("splitBy", function () {
  /*tslint:disable-next-line:no-invalid-this*/
  this.timeout(timeout);

  it(
    "should split values",
    marbles((m) => {
      const source = m.cold(" --a-b-c-a-b-c-|");
      const x = m.cold("      --a-----a-----|");
      const y = m.cold("      ----b-c---b-c-|");
      const expected = "      (xy)----------|";

      const split = source.pipe(
        splitBy((value) => value === "a"),
        mergeMap((splits) => splits)
      );
      m.expect(split).toBeObservable(expected, { x, y });
    })
  );

  if (!(global as any).window) {
    const expectSnippet = expecter(
      (code) => `
        import { Observable, of } from "rxjs";
        import { splitBy } from "./source/operators/splitBy";
        ${code}
      `,
      compiler
    );

    it("should infer a type guard predicate", () => {
      expectSnippet(`
        function isNumber(value: any): value is number {
          return typeof value === "string";
        }
        const split = of(42 as any, "54" as any).pipe(
          splitBy(isNumber)
        );
      `).toInfer("split", "Observable<[Observable<number>, Observable<any>]>");
    });
  }
});
