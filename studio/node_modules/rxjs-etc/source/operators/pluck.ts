/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */

import { OperatorFunction } from "rxjs";
import { pluck as untypedPluck } from "rxjs/operators";

export function pluck<T, K1 extends keyof T>(
  k1: K1
): OperatorFunction<T, T[K1]>;

export function pluck<T, K1 extends keyof T, K2 extends keyof T[K1]>(
  k1: K1,
  k2: K2
): OperatorFunction<T, T[K1][K2]>;

export function pluck<
  T,
  K1 extends keyof T,
  K2 extends keyof T[K1],
  K3 extends keyof T[K1][K2]
>(k1: K1, k2: K2, k3: K3): OperatorFunction<T, T[K1][K2][K3]>;

export function pluck<
  T,
  K1 extends keyof T,
  K2 extends keyof T[K1],
  K3 extends keyof T[K1][K2],
  K4 extends keyof T[K1][K2][K3]
>(k1: K1, k2: K2, k3: K3, k4: K4): OperatorFunction<T, T[K1][K2][K3][K4]>;

export function pluck<
  T,
  K1 extends keyof T,
  K2 extends keyof T[K1],
  K3 extends keyof T[K1][K2],
  K4 extends keyof T[K1][K2][K3],
  K5 extends keyof T[K1][K2][K3][K4]
>(
  k1: K1,
  k2: K2,
  k3: K3,
  k4: K4,
  k5: K5
): OperatorFunction<T, T[K1][K2][K3][K4][K5]>;

export function pluck<
  T,
  K1 extends keyof T,
  K2 extends keyof T[K1],
  K3 extends keyof T[K1][K2],
  K4 extends keyof T[K1][K2][K3],
  K5 extends keyof T[K1][K2][K3][K4],
  K6 extends keyof T[K1][K2][K3][K4][K5]
>(
  k1: K1,
  k2: K2,
  k3: K3,
  k4: K4,
  k5: K5,
  k6: K6
): OperatorFunction<T, T[K1][K2][K3][K4][K5][K6]>;

export function pluck<T, R>(
  ...keys: (string | number)[]
): OperatorFunction<T, R>;

export function pluck<T>(...keys: any[]): OperatorFunction<T, any> {
  return (source) => untypedPluck(...keys)(source);
}
