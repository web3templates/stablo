/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:no-unused-expression*/

import { marbles } from "rxjs-marbles";
import { expecter } from "ts-snippet";
import { compiler } from "../compiler-spec";
import { timeout } from "../timeout-spec";
import { instanceOf } from "./instanceOf";

// prettier-ignore
describe("instanceOf", function(): void {
  /*tslint:disable-next-line:no-invalid-this*/
  this.timeout(timeout);

  describe("functionality", () => {
    class Base {}
    class Something extends Base {}
    class SomethingElse extends Base {}

    const base = new Base();
    const something = new Something();
    const somethingElse = new SomethingElse();
    const values = { b: base, e: somethingElse, s: something };

    it(
      "should filter using a single instance type",
      marbles(m => {
        const source = m.cold("   bbssee|", values);
        const expected = m.cold(" --ss--|", values);

        const destination = source.pipe(instanceOf(Something));
        m.expect(destination).toBeObservable(expected);
      })
    );

    it(
      "should filter using a union of instance types",
      marbles(m => {
        const source = m.cold("   bbssee|", values);
        const expected = m.cold(" --ssee|", values);

        const destination = source.pipe(
          instanceOf({ Something, SomethingElse })
        );
        m.expect(destination).toBeObservable(expected);
      })
    );
  });

  if (!(global as any).window) {
    describe("types", () => {
      const expectSnippet = expecter(
        code => `
          import { of } from "rxjs";
          import { instanceOf } from "./source/operators";
          class Base {}
          class Something extends Base {}
          class SomethingElse extends Base {}
          ${code}
        `,
        compiler
      );

      it("should infer a single instance type", () => {
        expectSnippet(`
          const source = of<Base>(new Something());
          const filtered = source.pipe(instanceOf(Something));
        `).toInfer("filtered", "Observable<Something>");
      });

      it("should infer a union of instance types", () => {
        expectSnippet(`
          const source = of<Base>(new Something());
          const filtered = source.pipe(instanceOf({ Something, SomethingElse }));
        `).toInfer("filtered", "Observable<Something | SomethingElse>");
      });
    });
  }
});
