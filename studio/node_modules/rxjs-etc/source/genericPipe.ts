/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:deprecation*/

import {
  MonoTypeOperatorFunction,
  Observable,
  pipe as _pipe,
  UnaryFunction,
} from "rxjs";

/** @deprecated Inferring a generic can be unsafe; use genericOperator instead */
export function genericPipe<T>(
  ...operators: MonoTypeOperatorFunction<T>[]
): <R extends T>(source: Observable<R>) => Observable<R>;

/** @deprecated Inferring a generic can be unsafe; use genericOperator instead */
export function genericPipe<T>(
  ...operators: UnaryFunction<T, T>[]
): <R extends T>(source: R) => R;

/** @deprecated Inferring a generic can be unsafe; use genericOperator instead */
export function genericPipe<T, A>(
  op1: UnaryFunction<T, A>
): UnaryFunction<T, A>;

/** @deprecated Inferring a generic can be unsafe; use genericOperator instead */
export function genericPipe<T, A, B>(
  op1: UnaryFunction<T, A>,
  op2: UnaryFunction<A, B>
): UnaryFunction<T, B>;

/** @deprecated Inferring a generic can be unsafe; use genericOperator instead */
export function genericPipe<T, A, B, C>(
  op1: UnaryFunction<T, A>,
  op2: UnaryFunction<A, B>,
  op3: UnaryFunction<B, C>
): UnaryFunction<T, C>;

/** @deprecated Inferring a generic can be unsafe; use genericOperator instead */
export function genericPipe<T, A, B, C, D>(
  op1: UnaryFunction<T, A>,
  op2: UnaryFunction<A, B>,
  op3: UnaryFunction<B, C>,
  op4: UnaryFunction<C, D>
): UnaryFunction<T, D>;

/** @deprecated Inferring a generic can be unsafe; use genericOperator instead */
export function genericPipe<T, A, B, C, D, E>(
  op1: UnaryFunction<T, A>,
  op2: UnaryFunction<A, B>,
  op3: UnaryFunction<B, C>,
  op4: UnaryFunction<C, D>,
  op5: UnaryFunction<D, E>
): UnaryFunction<T, E>;

/** @deprecated Inferring a generic can be unsafe; use genericOperator instead */
export function genericPipe<T, A, B, C, D, E, F>(
  op1: UnaryFunction<T, A>,
  op2: UnaryFunction<A, B>,
  op3: UnaryFunction<B, C>,
  op4: UnaryFunction<C, D>,
  op5: UnaryFunction<D, E>,
  op6: UnaryFunction<E, F>
): UnaryFunction<T, F>;

/** @deprecated Inferring a generic can be unsafe; use genericOperator instead */
export function genericPipe<T, A, B, C, D, E, F, G>(
  op1: UnaryFunction<T, A>,
  op2: UnaryFunction<A, B>,
  op3: UnaryFunction<B, C>,
  op4: UnaryFunction<C, D>,
  op5: UnaryFunction<D, E>,
  op6: UnaryFunction<E, F>,
  op7: UnaryFunction<F, G>
): UnaryFunction<T, G>;

/** @deprecated Inferring a generic can be unsafe; use genericOperator instead */
export function genericPipe<T, A, B, C, D, E, F, G, H>(
  op1: UnaryFunction<T, A>,
  op2: UnaryFunction<A, B>,
  op3: UnaryFunction<B, C>,
  op4: UnaryFunction<C, D>,
  op5: UnaryFunction<D, E>,
  op6: UnaryFunction<E, F>,
  op7: UnaryFunction<F, G>,
  op8: UnaryFunction<G, H>
): UnaryFunction<T, H>;

/** @deprecated Inferring a generic can be unsafe; use genericOperator instead */
export function genericPipe<T, A, B, C, D, E, F, G, H, I>(
  op1: UnaryFunction<T, A>,
  op2: UnaryFunction<A, B>,
  op3: UnaryFunction<B, C>,
  op4: UnaryFunction<C, D>,
  op5: UnaryFunction<D, E>,
  op6: UnaryFunction<E, F>,
  op7: UnaryFunction<F, G>,
  op8: UnaryFunction<G, H>,
  op9: UnaryFunction<H, I>
): UnaryFunction<T, I>;

/** @deprecated Inferring a generic can be unsafe; use genericOperator instead */
export function genericPipe<T, A, B, C, D, E, F, G, H, I>(
  op1: UnaryFunction<T, A>,
  op2: UnaryFunction<A, B>,
  op3: UnaryFunction<B, C>,
  op4: UnaryFunction<C, D>,
  op5: UnaryFunction<D, E>,
  op6: UnaryFunction<E, F>,
  op7: UnaryFunction<F, G>,
  op8: UnaryFunction<G, H>,
  op9: UnaryFunction<H, I>,
  ...operators: UnaryFunction<any, any>[]
): UnaryFunction<T, {}>;

export function genericPipe(
  ...operators: UnaryFunction<any, any>[]
): UnaryFunction<any, any> {
  return _pipe.apply(undefined, operators as any);
}

/** @deprecated Inferring a generic can be unsafe; use genericOperator instead */
export const pipe = genericPipe;
