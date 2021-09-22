/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:no-unused-expression*/

import { marbles } from "rxjs-marbles";
import { TestObservableLike } from "rxjs-marbles/types";
import { pause, PausedState } from "./pause";

const pausedValues = { p: "paused", r: "resumed" };

// prettier-ignore
describe("pause", () => {
  it(
    "should pause and resume",
    marbles(m => {
      const source = m.cold("   ab-----c-d-e----|");
      const notifier = m.cold(" --r-----p---r----", pausedValues) as TestObservableLike<PausedState>;
      const expected = "        --(ab)-c----(de)|";

      const result = source.pipe(pause(notifier, "paused"));
      m.expect(result).toBeObservable(expected);
    })
  );

  it(
    "should pause complete notifications",
    marbles(m => {
      const source = m.cold("   ab|-----");
      const notifier = m.cold(" ---r----", pausedValues) as TestObservableLike<PausedState>;
      const expected = "        ---(ab|)";

      const result = source.pipe(pause(notifier, "paused"));
      m.expect(result).toBeObservable(expected);
    })
  );

  it(
    "should not pause error notifications",
    marbles(m => {
      const source = m.cold("   ab#-----");
      const notifier = m.cold(" ---r----", pausedValues) as TestObservableLike<PausedState>;
      const expected = "        --#";

      const result = source.pipe(pause(notifier, "paused"));
      m.expect(result).toBeObservable(expected);
    })
  );
});
