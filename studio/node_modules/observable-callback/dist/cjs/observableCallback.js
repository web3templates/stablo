"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.observableCallback = void 0;
var rxjs_1 = require("rxjs");
var pass = function (input$) { return input$; };
function observableCallback(operator) {
    if (operator === void 0) { operator = pass; }
    var subject = new rxjs_1.Subject();
    return [subject.pipe(operator), function (arg) { return subject.next(arg); }];
}
exports.observableCallback = observableCallback;
