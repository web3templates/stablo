import { Observable, OperatorFunction } from "rxjs";
export declare function observableCallback(): [Observable<void>, () => void];
export declare function observableCallback<T>(): [Observable<T>, (arg: T) => void];
export declare function observableCallback<T, K>(operator: OperatorFunction<T, K>): [Observable<K>, (arg: T) => void];
