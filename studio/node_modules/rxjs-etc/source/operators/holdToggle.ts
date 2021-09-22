/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */

import { MonoTypeOperatorFunction, Observable } from "rxjs";
import { bufferToggle, concatAll } from "rxjs/operators";

export function holdToggle<T, C>(
  captures: Observable<C>,
  releaseSelector: (value: C) => Observable<C>
): MonoTypeOperatorFunction<T> {
  return (source) =>
    source.pipe(bufferToggle(captures, releaseSelector), concatAll());
}
