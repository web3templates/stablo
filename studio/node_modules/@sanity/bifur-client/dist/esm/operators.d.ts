import { Observable } from 'rxjs';
export declare const timeoutFirstWith: <T>(due: number, withObservable: Observable<any>) => (input$: Observable<T>) => Observable<T>;
