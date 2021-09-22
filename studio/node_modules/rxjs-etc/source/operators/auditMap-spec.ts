/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:no-unused-expression*/

import { of } from "rxjs";
import { marbles } from "rxjs-marbles";
import { delay } from "rxjs/operators";
import { auditMap } from "./auditMap";

// prettier-ignore
describe("auditMap", () => {
  it(
    "should emit an isolated notification",
    marbles(m => {
      const source = m.hot(" --a-------");
      //                       --a
      const expected = "     ----a-----";

      const duration = m.time("--|");
      const result = source.pipe(
        auditMap(value => of(value).pipe(delay(duration)))
      );
      m.expect(result).toBeObservable(expected);
    })
  );

  it(
    "should emit the last of two notifications",
    marbles(m => {
      const source = m.hot(" --ab------");
      //                       --a
      //                         --b
      const expected = "     ------b---";

      const duration = m.time("--|");
      const result = source.pipe(
        auditMap(value => of(value).pipe(delay(duration)))
      );
      m.expect(result).toBeObservable(expected);
    })
  );

  it(
    "should emit the last of three notifications",
    marbles(m => {
      const source = m.hot(" --abc-----");
      //                       --a
      //                         --c
      const expected = "     ------c---";

      const duration = m.time("--|");
      const result = source.pipe(
        auditMap(value => of(value).pipe(delay(duration)))
      );
      m.expect(result).toBeObservable(expected);
    })
  );

  it(
    "should emit separated notifications",
    marbles(m => {
      const source = m.hot(" --a---b---");
      //                       --a
      //                           --b
      const expected = "     ----a---b-";

      const duration = m.time("--|");
      const result = source.pipe(
        auditMap(value => of(value).pipe(delay(duration)))
      );
      m.expect(result).toBeObservable(expected);
    })
  );
});
