/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:deprecation no-unused-expression*/

import { expect } from "chai";
import { marbles } from "rxjs-marbles";
import { delay, distinctUntilChanged } from "rxjs/operators";
import { expecter } from "ts-snippet";
import { compiler } from "./compiler-spec";
import { genericPipe, pipe } from "./genericPipe";
import { timeout } from "./timeout-spec";

// prettier-ignore
describe("genericPipe", function(): void {
  /*tslint:disable-next-line:no-invalid-this*/
  this.timeout(timeout);

  describe("functionality", () => {
    it("should export an alias", () => {
      expect(pipe).to.equal(genericPipe);
    });

    it(
      "should pipe a mono-type operator",
      marbles(m => {
        const source = m.cold(" -a-|");
        const expected = "      --a|";

        const duration = m.time("-|");
        const operator = genericPipe(delay(duration));
        const destination = source.pipe(operator);
        m.expect(destination).toBeObservable(expected);
      })
    );

    it(
      "should pipe multiple mono-type operators",
      marbles(m => {
        const source = m.cold(" -a-a-|");
        const expected = "      --a--|";

        const duration = m.time("-|");
        const operator = genericPipe(delay(duration), distinctUntilChanged());
        const destination = source.pipe(operator);
        m.expect(destination).toBeObservable(expected);
      })
    );
  });

  if (!(global as any).window) {
    describe("types", () => {
      const expectSnippet = expecter(
        code => `
          import { of } from "rxjs";
          import { delay, map, mapTo, switchAll } from "rxjs/operators";
          import { genericPipe } from "./source/genericPipe";
          ${code}
        `,
        compiler
      );

      it("should infer a non-generic operator for a mono-type operator", () => {
        const snippet = expectSnippet(`
          const operator = delay(10);
          const piped = genericPipe(operator);
          const source = of(1);
          const delayed = source.pipe(piped);
        `);
        snippet.toInfer("operator", "MonoTypeOperatorFunction<unknown>");
        snippet.toInfer(
          "piped",
          "<R extends unknown>(source: Observable<R>) => Observable<R>"
        );
        snippet.toInfer("source", "Observable<number>");
        snippet.toInfer("delayed", "Observable<number>");
      });

      it("should infer a non-generic operator for a non-mono-type operator", () => {
        const snippet = expectSnippet(`
          const operator = map((value: number) => value.toString());
          const piped = genericPipe(operator);
          const source = of(1);
          const delayed = source.pipe(piped);
        `);
        snippet.toInfer("operator", "OperatorFunction<number, string>");
        snippet.toInfer(
          "piped",
          "UnaryFunction<Observable<number>, Observable<string>>"
        );
        snippet.toInfer("source", "Observable<number>");
        snippet.toInfer("delayed", "Observable<string>");
      });

      it("should match Observable<any> only for excess parameters", () => {
        const snippet = expectSnippet(`
          const piped = genericPipe(mapTo(1), switchAll());
        `);
        snippet.toFail(/is not assignable to type/);
      });
    });
  }
});
