export default class PlainProbe {
    _value: any;
    path: Array<any>;
    constructor(_value: any, path?: Array<any>);
    containerType(): "primitive" | "array" | "object";
    length(): number;
    getIndex(i: number): any;
    hasAttribute(key: string): boolean;
    attributeKeys(): Array<string>;
    getAttribute(key: string): any;
    get(): any;
}
//# sourceMappingURL=PlainProbe.d.ts.map