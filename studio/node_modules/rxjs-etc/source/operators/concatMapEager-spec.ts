/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:no-unused-expression rxjs-no-ignored-subscription*/

import { expect } from "chai";
import { asapScheduler, Observable, of } from "rxjs";
import { marbles } from "rxjs-marbles";
import { observeOn } from "rxjs/operators";
import { concatMapEager } from "./concatMapEager";

describe("concatMapEager", () => {
  it("should support a synchronous source with synchronous inners", () => {
    const source = of(0, 1, 2);
    const inners = [of("x"), of("y"), of("z")];
    const result = source.pipe(concatMapEager((value) => inners[value]));

    const values: string[] = [];
    result.subscribe({
      complete() {
        expect(values).to.deep.equal(["x", "y", "z"]);
      },
      next(value: string) {
        values.push(value);
      },
    });
  });

  it("should support a synchronous source with some asynchronous inners", (done: Mocha.Done) => {
    const source = of(0, 1, 2);
    const inners = [of("x").pipe(observeOn(asapScheduler)), of("y"), of("z")];
    const result = source.pipe(concatMapEager((value) => inners[value]));

    const values: string[] = [];
    result.subscribe({
      complete() {
        expect(values).to.deep.equal(["x", "y", "z"]);
        done();
      },
      next(value: string) {
        values.push(value);
      },
    });
  });

  it(
    "should complete if the source completes",
    marbles((m) => {
      const source = m.cold(" a-b-(c|)    ");
      const x = m.cold("      ---(x|)     ");
      const xsub = "          ^--!------- ";
      const y = m.cold("        ---(y|)   ");
      const ysub = "          --^--!----- ";
      const z = m.cold("          ---(z|) ");
      const zsub = "          ----^--!--- ";
      const expected = "      ---x-y-(z|) ";

      const map: Record<string, Observable<string>> = { a: x, b: y, c: z };
      const result = source.pipe(concatMapEager((value) => map[value]));
      m.expect(result).toBeObservable(expected);
      m.expect(x).toHaveSubscriptions(xsub);
      m.expect(y).toHaveSubscriptions(ysub);
      m.expect(z).toHaveSubscriptions(zsub);
    })
  );

  it(
    "should not complete if the source does not complete",
    marbles((m) => {
      const source = m.cold(" a-b-c       ");
      const x = m.cold("      ---(x|)     ");
      const xsub = "          ^--!------- ";
      const y = m.cold("        ---(y|)   ");
      const ysub = "          --^--!----- ";
      const z = m.cold("          ---(z|) ");
      const zsub = "          ----^--!--- ";
      const expected = "      ---x-y-z    ";

      const map: Record<string, Observable<string>> = { a: x, b: y, c: z };
      const result = source.pipe(concatMapEager((value) => map[value]));
      m.expect(result).toBeObservable(expected);
      m.expect(x).toHaveSubscriptions(xsub);
      m.expect(y).toHaveSubscriptions(ysub);
      m.expect(z).toHaveSubscriptions(zsub);
    })
  );

  it(
    "should not emit subsequent inners if a preceding inner does not complete",
    marbles((m) => {
      const source = m.cold(" a-b-c       ");
      const x = m.cold("      ---(x|)     ");
      const xsub = "          ^--!------- ";
      const y = m.cold("        ---y----- ");
      const ysub = "          --^-------- ";
      const z = m.cold("          ---(z|) ");
      const zsub = "          ----^--!--- ";
      const expected = "      ---x-y----- ";

      const map: Record<string, Observable<string>> = { a: x, b: y, c: z };
      const result = source.pipe(concatMapEager((value) => map[value]));
      m.expect(result).toBeObservable(expected);
      m.expect(x).toHaveSubscriptions(xsub);
      m.expect(y).toHaveSubscriptions(ysub);
      m.expect(z).toHaveSubscriptions(zsub);
    })
  );

  it(
    "should not emit anything if the first inner never emits",
    marbles((m) => {
      const source = m.cold(" a-b-c       ");
      const x = m.cold("      ----------- ");
      const xsub = "          ^---------- ";
      const y = m.cold("        ---(y|)   ");
      const ysub = "          --^--!----- ";
      const z = m.cold("          ---(z|) ");
      const zsub = "          ----^--!--- ";
      const expected = "      ----------- ";

      const map: Record<string, Observable<string>> = { a: x, b: y, c: z };
      const result = source.pipe(concatMapEager((value) => map[value]));
      m.expect(result).toBeObservable(expected);
      m.expect(x).toHaveSubscriptions(xsub);
      m.expect(y).toHaveSubscriptions(ysub);
      m.expect(z).toHaveSubscriptions(zsub);
    })
  );

  it(
    "should support concurrency",
    marbles((m) => {
      const source = m.cold(" a-b-(c|)         ");
      const x = m.cold("      ------(x|)       ");
      const xsub = "          ^-----!--------- ";
      const y = m.cold("        ------(y|)     ");
      const ysub = "          --^-----!------- ";
      const z = m.cold("            ------(z|) ");
      const zsub = "          ------^-----!    ";
      const expected = "      ------x-y---(z|) ";

      const map: Record<string, Observable<string>> = { a: x, b: y, c: z };
      const result = source.pipe(concatMapEager((value) => map[value], 2));
      m.expect(result).toBeObservable(expected);
      m.expect(x).toHaveSubscriptions(xsub);
      m.expect(y).toHaveSubscriptions(ysub);
      m.expect(z).toHaveSubscriptions(zsub);
    })
  );

  it(
    "should behave like concatMap if concurrency is one",
    marbles((m) => {
      const source = m.cold(" a-b-(c|)               ");
      const x = m.cold("      ------(x|)             ");
      const xsub = "          ^-----!--------------- ";
      const y = m.cold("            ------(y|)       ");
      const ysub = "          ------^-----!--------- ";
      const z = m.cold("                  ------(z|) ");
      const zsub = "          ------------^-----!--- ";
      const expected = "      ------x-----y-----(z|) ";

      const map: Record<string, Observable<string>> = { a: x, b: y, c: z };
      const result = source.pipe(concatMapEager((value) => map[value], 1));
      m.expect(result).toBeObservable(expected);
      m.expect(x).toHaveSubscriptions(xsub);
      m.expect(y).toHaveSubscriptions(ysub);
      m.expect(z).toHaveSubscriptions(zsub);
    })
  );

  it(
    "should emit inners in concat order",
    marbles((m) => {
      const source = m.cold(" a-b-(c|)         ");
      const x = m.cold("      ----------(x|)   ");
      const xsub = "          ^---------!----- ";
      const y = m.cold("        ------(y|)     ");
      const ysub = "          --^-----!------- ";
      const z = m.cold("          --(z|)       ");
      const zsub = "          ----^-!--------- ";
      const expected = "      ----------(xyz|) ";

      const map: Record<string, Observable<string>> = { a: x, b: y, c: z };
      const result = source.pipe(concatMapEager((value) => map[value]));
      m.expect(result).toBeObservable(expected);
      m.expect(x).toHaveSubscriptions(xsub);
      m.expect(y).toHaveSubscriptions(ysub);
      m.expect(z).toHaveSubscriptions(zsub);
    })
  );

  it(
    "should error when the an inner errors",
    marbles((m) => {
      const source = m.cold(" a-b-(c|)         ");
      const x = m.cold("      ----------(x|)   ");
      const xsub = "          ^-----!--------- ";
      const y = m.cold("        ------(y|)     ");
      const ysub = "          --^---!--------- ";
      const z = m.cold("          --#          ");
      const zsub = "          ----^-!--------- ";
      const expected = "      ------#--------- ";

      const map: Record<string, Observable<string>> = { a: x, b: y, c: z };
      const result = source.pipe(concatMapEager((value) => map[value]));
      m.expect(result).toBeObservable(expected);
      m.expect(x).toHaveSubscriptions(xsub);
      m.expect(y).toHaveSubscriptions(ysub);
      m.expect(z).toHaveSubscriptions(zsub);
    })
  );
});
