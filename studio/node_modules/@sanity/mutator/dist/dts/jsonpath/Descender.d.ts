import Expression from './Expression';
export declare type Probe = {
    containerType(): string;
    length(): number;
    getIndex(index: number): any;
    get: () => any;
    getAttribute(string: any): any;
    attributeKeys(): string[];
    hasAttribute(attr: string): boolean;
};
export default class Descender {
    head: Expression;
    tail: Expression;
    constructor(head: Expression, tail: Expression);
    iterate(probe: Probe): Array<Descender>;
    isRecursive(): boolean;
    hasArrived(): boolean;
    extractRecursives(): Array<Descender>;
    iterateConstraints(probe: Probe): Array<Descender>;
    descend(): Array<Descender>;
    toString(): string;
}
//# sourceMappingURL=Descender.d.ts.map