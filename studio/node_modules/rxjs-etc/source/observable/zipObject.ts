/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */

import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { isObservable } from "../util";
import { zipArray } from "./zipArray";

/**
 * Like the `zip` operator, but instead of an array, it takes an object. The properties of this object can be Observable
 * or non-Observable. `zipObject` subscribes to the Observable properties and combines them into an object that mirrors
 * the input object, but with the notification values of those Observables. Non-Observable values are wrapped with `of` before zipping.
 *
 * ## Example
 * Combine name, weight, and species of animals
 * ```typescript
 * import { zipObject } from 'rxjs-etc';
 *
 * let name$ = of('kitty', 'doggo', 'chirpy');
 * let weight$ = of(4, 7, 0.5);
 * let species$ = of('Dog', 'Cat', 'Bird');
 *
 * zipObject({
 *   name: name$,
 *   weight: weight$,
 *   species: species$
 * })
 * .subscribe(value => console.log(value));
 *
 * // Output:
 * // { name: 'kitty', weight: 4, species: 'Cat'}
 * // { name: 'doggo', weight: 7, species: 'Dog' }
 * // { name: 'chirpy', weight: 0.5, species: 'Bird' }
 * ```
 * @param instance
 * @return {Observable<T>}
 * @static true
 * @name zipObject
 */
export function zipObject<T>(
  instance: { [K in keyof T]: T[K] | Observable<T[K]> }
): Observable<T> {
  type K = keyof T;
  const entries = Object.entries(instance) as [K, T[K] | Observable<T[K]>][];
  const observables = entries.map(([, value]) =>
    isObservable(value) ? value : of(value)
  );
  return zipArray(observables).pipe(
    map((values) =>
      values.reduce((acc, value, index) => {
        acc[entries[index][0]] = value;
        return acc;
      }, {} as T)
    )
  );
}
