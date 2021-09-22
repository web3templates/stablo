/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:no-unused-expression rxjs-no-ignored-subscription*/

import { expect } from "chai";
import { ReplaySubject, Subject } from "rxjs";
import * as sinon from "sinon";
import { resettable } from "./resettable";

describe("resettable", () => {
  it("should next the factory-created subject", () => {
    const mockSubject: Subject<number> = {
      complete: sinon.stub(),
      error: sinon.stub(),
      next: sinon.stub(),
    } as any;

    const { subject } = resettable(() => mockSubject);
    subject.next(1);

    expect(mockSubject.next).to.have.property("called", true);
  });

  it("should reset the subject", () => {
    const { observable, reset, subject } = resettable(
      () => new ReplaySubject<number>(3)
    );

    const a: number[] = [];
    observable.subscribe((value) => a.push(value));

    subject.next(1);
    subject.next(2);
    subject.next(3);
    subject.next(4);

    const b: number[] = [];
    observable.subscribe((value) => b.push(value));

    reset();

    const c: number[] = [];
    observable.subscribe((value) => c.push(value));

    subject.next(5);
    subject.next(6);

    const d: number[] = [];
    observable.subscribe((value) => d.push(value));

    expect(a).to.deep.equal([1, 2, 3, 4, 5, 6]);
    expect(b).to.deep.equal([2, 3, 4, 5, 6]);
    expect(c).to.deep.equal([5, 6]);
    expect(d).to.deep.equal([5, 6]);
  });

  it("should support arguments", () => {
    const { observable, reset, subject } = resettable(
      (count: number) => new ReplaySubject<number>(count),
      2
    );

    const a: number[] = [];
    observable.subscribe((value) => a.push(value));

    subject.next(1);
    subject.next(2);
    subject.next(3);
    subject.next(4);

    const b: number[] = [];
    observable.subscribe((value) => b.push(value));

    reset(1);

    const c: number[] = [];
    observable.subscribe((value) => c.push(value));

    subject.next(5);
    subject.next(6);

    const d: number[] = [];
    observable.subscribe((value) => d.push(value));

    expect(a).to.deep.equal([1, 2, 3, 4, 5, 6]);
    expect(b).to.deep.equal([3, 4, 5, 6]);
    expect(c).to.deep.equal([5, 6]);
    expect(d).to.deep.equal([6]);
  });
});
