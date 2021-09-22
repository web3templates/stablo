/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:no-unused-expression*/

import { expect } from "chai";
import { asapScheduler, EMPTY } from "rxjs";
import { isNonNulled, isNulled, isObservable, isScheduler } from "./util";

describe("util", () => {
  describe("isNonNulled", () => {
    it("should determine whether a value is not nulled", () => {
      expect(isNonNulled(null)).to.be.false;
      expect(isNonNulled(undefined)).to.be.false;
      expect(isNonNulled(false)).to.be.true;
      expect(isNonNulled(0)).to.be.true;
      expect(isNonNulled("")).to.be.true;
    });
  });

  describe("isNulled", () => {
    it("should determine whether a value is nulled", () => {
      expect(isNulled(null)).to.be.true;
      expect(isNulled(undefined)).to.be.true;
      expect(isNulled(false)).to.be.false;
      expect(isNulled(0)).to.be.false;
      expect(isNulled("")).to.be.false;
    });
  });

  describe("isObservable", () => {
    it("should determine whether a value is an observable", () => {
      expect(isObservable(null)).to.be.false;
      expect(isObservable(undefined)).to.be.false;
      expect(isObservable({})).to.be.false;
      expect(isObservable(EMPTY)).to.be.true;
    });
  });

  describe("isScheduler", () => {
    it("should determine whether a value is a scheduler", () => {
      expect(isScheduler(null)).to.be.false;
      expect(isScheduler(undefined)).to.be.false;
      expect(isScheduler({})).to.be.false;
      expect(isScheduler(asapScheduler)).to.be.true;
    });
  });
});
