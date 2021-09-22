/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:no-use-before-declare*/

import {
  Observable,
  Operator,
  OperatorFunction,
  Subject,
  Subscriber,
  TeardownLogic,
} from "rxjs";

export function bucketBy<T>(
  count: number,
  hashSelector: (value: T, index: number) => number,
  subjectSelector: () => Subject<T> = () => new Subject<T>()
): OperatorFunction<T, Observable<T>[]> {
  return (source) =>
    source.lift(new BucketByOperator<T>(count, hashSelector, subjectSelector));
}

/*tslint:disable-next-line:no-unused-declaration*/
class BucketByOperator<T> implements Operator<T, Observable<T>[]> {
  constructor(
    private count: number,
    private hashSelector: (value: T, index: number) => number,
    private subjectSelector: () => Subject<T>
  ) {}
  call(subscriber: Subscriber<Observable<T>[]>, source: any): TeardownLogic {
    return source.subscribe(
      new BucketBySubscriber(
        subscriber,
        this.count,
        this.hashSelector,
        this.subjectSelector
      )
    );
  }
}

/*tslint:disable-next-line:no-unused-declaration*/
class BucketBySubscriber<T> extends Subscriber<T> {
  private buckets: Subject<T>[];
  private index = 0;

  constructor(
    destination: Subscriber<Observable<T>[]>,
    private count: number,
    private hashSelector: (value: T, index: number) => number,
    private subjectSelector: () => Subject<T>
  ) {
    super(destination);
    const buckets = (this.buckets = new Array(count));
    for (let i = 0; i < count; ++i) {
      buckets[i] = subjectSelector();
    }
    destination.next!(buckets.map((subject) => subject.asObservable()));
  }

  protected _next(value: T): void {
    const { buckets, closed, count, hashSelector } = this;
    if (closed) {
      return;
    }
    let index: number;
    try {
      const hash = hashSelector(value, this.index++);
      index = Math.abs(Math.floor(hash)) % count;
    } catch (error: unknown) {
      this.error(error);
      return;
    }
    buckets[index].next(value);
  }

  protected _error(error: any): void {
    const { buckets, closed, destination } = this;
    if (closed) {
      return;
    }
    buckets.forEach((bucket) => bucket.error(error));
    destination.error!(error);
  }

  protected _complete(): void {
    const { buckets, closed, destination } = this;
    if (closed) {
      return;
    }
    buckets.forEach((bucket) => bucket.complete());
    destination.complete!();
  }
}
