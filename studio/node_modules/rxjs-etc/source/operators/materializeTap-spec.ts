/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:no-unused-expression*/

import { Notification, Subject } from "rxjs";
import { marbles } from "rxjs-marbles";
import { materializeTap } from "./materializeTap";

// prettier-ignore
describe("materializeTap", () => {
  it("should tap into next", marbles(m => {
    const source = m.cold(" ---a----");
    const expected = "      ---n----";
    const subject = new Subject<Notification<string>>();
    const tapped = source.pipe(materializeTap(notification => subject.next(notification)));
    m.expect(tapped).toBeObservable(source);
    m.expect(subject).toBeObservable(expected, {
      n: new Notification("N", "a")
    });
  }));

  it("should tap into error", marbles(m => {
    const source = m.cold(" ---#----");
    const expected = "      ---n----";
    const subject = new Subject<Notification<string>>();
    const tapped = source.pipe(materializeTap(notification => subject.next(notification)));
    m.expect(tapped).toBeObservable(source);
    m.expect(subject).toBeObservable(expected, {
      n: new Notification("E", undefined, "error")
    });
  }));

  it("should tap into complete", marbles(m => {
    const source = m.cold(" ---|");
    const expected = "      ---n";
    const subject = new Subject<Notification<string>>();
    const tapped = source.pipe(materializeTap(notification => subject.next(notification)));
    m.expect(tapped).toBeObservable(source);
    m.expect(subject).toBeObservable(expected, {
      n: new Notification("C")
    });
  }));
});
