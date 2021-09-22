/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */

import { MonoTypeOperatorFunction, Observable } from "rxjs";
import { bufferWhen, concatAll } from "rxjs/operators";

export function holdWhen<T>(
  releaseSelector: () => Observable<any>
): MonoTypeOperatorFunction<T> {
  return (source) => source.pipe(bufferWhen(releaseSelector), concatAll());
}
