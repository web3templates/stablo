/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */

import { Observable, OperatorFunction } from "rxjs";
import { map } from "rxjs/operators";

export function guard<T, R extends T>(
  guard: (value: T) => value is R,
  message?: string
): OperatorFunction<T, R> {
  return (source: Observable<T>) =>
    source.pipe(
      map((value: any) => {
        if (guard(value)) {
          return value;
        }

        const error = new Error(message || "Guard rejection.");
        (error as any)["value"] = value;
        throw error;
      })
    );
}
