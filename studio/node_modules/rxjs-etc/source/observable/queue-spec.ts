/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:no-unused-expression*/

import { expecter } from "ts-snippet";
import { compiler } from "../compiler-spec";
import { timeout } from "../timeout-spec";

// prettier-ignore
describe("queue", function(): void {
  /*tslint:disable-next-line:no-invalid-this*/
  this.timeout(timeout);

  if (!(global as any).window) {
    describe("types", () => {
      const expectSnippet = expecter(
        code => `
          import { of, merge } from "rxjs";
          import * as p from "./source/placeholders-spec";
          import { queue } from "./source/observable";
          ${code}
        `,
        compiler
      );

      it("should infer source types", () => {
        const snippet = expectSnippet(`
          const q1 = queue(p.o1);
          const q2 = queue(p.o1, p.o2);
          const q3 = queue(p.o1, p.o2, p.o3);
          const q4 = queue(p.o1, p.o2, p.o3, p.o4);
          const q5 = queue(p.o1, p.o2, p.o3, p.o4, p.o5);
          const q6 = queue(p.o1, p.o2, p.o3, p.o4, p.o5, p.o6);
          const q7 = queue<any>(p.o1, p.o2, p.o3, p.o4, p.o5, p.o6, p.o7);
        `);
        snippet.toInfer("q1", "[Observable<T1>]");
        snippet.toInfer("q2", "[Observable<T1>, Observable<T2>]");
        snippet.toInfer(
          "q3",
          "[Observable<T1>, Observable<T2>, Observable<T3>]"
        );
        snippet.toInfer(
          "q4",
          "[Observable<T1>, Observable<T2>, Observable<T3>, Observable<T4>]"
        );
        snippet.toInfer(
          "q5",
          "[Observable<T1>, Observable<T2>, Observable<T3>, Observable<T4>, Observable<T5>]"
        );
        // This seems to fail in TypeScript 3.7 as an epllipsis is used:
        // snippet.toInfer(
        //   "q6",
        //   "[Observable<T1>, Observable<T2>, Observable<T3>, Observable<T4>, Observable<T5>, Observable<T6>]"
        // );
        snippet.toInfer("q7", "Observable<any>[]");
      });

      it("should play nice with merge's concurrency parameter", () => {
        // It seems that TypeScript does not match signatures using tuples:
        // https://github.com/Microsoft/TypeScript/issues/4130

        const snippet = expectSnippet(`
          const m2 = merge(...queue(p.o1, p.o2), 1);
        `);
        snippet.toInfer("m2", "Observable<T1 | T2>");
      });
    });
  }
});
