/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:no-unused-expression rxjs-no-sharereplay*/

import { marbles } from "rxjs-marbles";
import {
  auditTime,
  debounceTime,
  delay,
  sampleTime,
  shareReplay,
} from "rxjs/operators";
import { switchMapUntil } from "./switchMapUntil";

// prettier-ignore
describe("switchMapUntil", () => {
  it(
    "should play nice with auditTime",
    marbles(m => {
      const outer = m.hot("  oo-o-------");
      const osubs = "        ^----------";
      const inner = m.cold(" --i|");
      const isubs = [
        "                    --^!-------",
        "                    -----^--!--"
      ];
      const expected = "     -------i---";

      const destination = outer.pipe(
        switchMapUntil(auditTime(m.time("--|")), () => inner)
      );
      m.expect(destination).toBeObservable(expected);
      m.expect(outer).toHaveSubscriptions(osubs);
      m.expect(inner).toHaveSubscriptions(isubs);
    })
  );

  it(
    "should play nice with debounceTime",
    marbles(m => {
      const outer = m.hot("  oo--o------");
      const osubs = "        ^----------";
      const inner = m.cold(" --i|");
      const isubs = [
        "                    ---^!------",
        "                    ------^--!-"
      ];
      const expected = "     --------i--";

      const destination = outer.pipe(
        switchMapUntil(debounceTime(m.time("--|")), () => inner)
      );
      m.expect(destination).toBeObservable(expected);
      m.expect(outer).toHaveSubscriptions(osubs);
      m.expect(inner).toHaveSubscriptions(isubs);
    })
  );

  it(
    "should play nice with delay",
    marbles(m => {
      const outer = m.hot("  o--o-------");
      const osubs = "        ^----------";
      const inner = m.cold(" --i|");
      const isubs = [
        "                    --^!-------",
        "                    -----^--!--"
      ];
      const expected = "     -------i---";

      const destination = outer.pipe(
        switchMapUntil(delay(m.time("--|")), () => inner)
      );
      m.expect(destination).toBeObservable(expected);
      m.expect(outer).toHaveSubscriptions(osubs);
      m.expect(inner).toHaveSubscriptions(isubs);
    })
  );

  it(
    "should play nice with sampleTime",
    marbles(m => {
      const outer = m.hot("  oo-o------|");
      const osubs = "        ^---------!";
      const inner = m.cold(" --i|");
      const isubs = [
        "                    --^!-------",
        "                    ----^--!---"
      ];
      const expected = "     ------i---|";

      const destination = outer.pipe(
        switchMapUntil(sampleTime(m.time("--|")), () => inner)
      );
      m.expect(destination).toBeObservable(expected);
      m.expect(outer).toHaveSubscriptions(osubs);
      m.expect(inner).toHaveSubscriptions(isubs);
    })
  );

  it(
    "should play nice with cold sources",
    marbles(m => {
      const outer = m.cold(" oo--o------");
      const osubs = "        ^----------";
      const inner = m.cold(" --i|");
      const isubs = [
        "                    ---^!------",
        "                    ------^--!-"
      ];
      const expected = "     --------i--";

      const destination = outer.pipe(
        switchMapUntil(debounceTime(m.time("--|")), () => inner)
      );
      m.expect(destination).toBeObservable(expected);
      m.expect(outer).toHaveSubscriptions(osubs);
      m.expect(inner).toHaveSubscriptions(isubs);
    })
  );

  it(
    "should play nice with replay sources",
    marbles(m => {
      const outer = m.cold(" oo--o------");
      const osubs = "        ^----------";
      const inner = m.cold(" --i|");
      const isubs = [
        "                    ---^!------",
        "                    ------^--!-"
      ];
      const expected = "     --------i--";

      const replayed = outer.pipe(shareReplay(1));
      const destination = replayed.pipe(
        switchMapUntil(debounceTime(m.time("--|")), () => inner)
      );
      m.expect(destination).toBeObservable(expected);
      m.expect(outer).toHaveSubscriptions(osubs);
      m.expect(inner).toHaveSubscriptions(isubs);
    })
  );
});
