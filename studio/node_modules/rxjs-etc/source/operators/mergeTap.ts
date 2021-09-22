/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */

import { from, MonoTypeOperatorFunction, ObservableInput } from "rxjs";
import { ignoreElements, mergeMap } from "rxjs/operators";
import { endWith } from "./endWith";

export function mergeTap<T>(
  next: (value: T) => ObservableInput<any>
): MonoTypeOperatorFunction<T> {
  return (source) =>
    source.pipe(
      mergeMap((value) =>
        from(next(value)).pipe(ignoreElements(), endWith(value))
      )
    );
}
