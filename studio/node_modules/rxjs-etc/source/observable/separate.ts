/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */

import { Observable } from "rxjs";
import { filter, share } from "rxjs/operators";

function not<T>(
  ...predicates: ((value: T) => boolean)[]
): (value: T) => boolean {
  return (value) => predicates.every((predicate) => !predicate(value));
}

/** @deprecated Use the splitBy operator instead */
export function separate<T>(
  source: Observable<T>,
  predicate1: (value: T) => boolean
): [Observable<T>, Observable<T>];

/** @deprecated Use the splitBy operator instead */
export function separate<T>(
  source: Observable<T>,
  predicate1: (value: T) => boolean,
  predicate2: (value: T) => boolean
): [Observable<T>, Observable<T>, Observable<T>];

/** @deprecated Use the splitBy operator instead */
export function separate<T>(
  source: Observable<T>,
  predicate1: (value: T) => boolean,
  predicate2: (value: T) => boolean,
  predicate3: (value: T) => boolean
): [Observable<T>, Observable<T>, Observable<T>, Observable<T>];

/** @deprecated Use the splitBy operator instead */
export function separate<T>(
  source: Observable<T>,
  ...predicates: ((value: T) => boolean)[]
): Observable<T>[];

export function separate<T>(
  source: Observable<T>,
  ...predicates: ((value: T) => boolean)[]
): Observable<T>[] {
  const shared = source.pipe(share());
  return [
    ...predicates.map((predicate) => shared.pipe(filter(predicate))),
    shared.pipe(filter(not(...predicates))),
  ];
}
