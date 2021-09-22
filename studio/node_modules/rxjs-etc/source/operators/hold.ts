/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */

import { MonoTypeOperatorFunction, Observable } from "rxjs";
import { buffer, concatAll } from "rxjs/operators";

export function hold<T>(
  releaseNotifier: Observable<any>
): MonoTypeOperatorFunction<T> {
  return (source) => source.pipe(buffer(releaseNotifier), concatAll());
}
