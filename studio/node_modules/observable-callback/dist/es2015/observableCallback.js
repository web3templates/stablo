import { Subject } from "rxjs";
const pass = (input$) => input$;
export function observableCallback(operator = pass) {
    const subject = new Subject();
    return [subject.pipe(operator), (arg) => subject.next(arg)];
}
