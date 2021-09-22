import { Subject } from "rxjs";
var pass = function (input$) { return input$; };
export function observableCallback(operator) {
    if (operator === void 0) { operator = pass; }
    var subject = new Subject();
    return [subject.pipe(operator), function (arg) { return subject.next(arg); }];
}
