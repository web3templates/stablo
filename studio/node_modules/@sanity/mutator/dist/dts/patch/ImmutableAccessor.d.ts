export default class ImmutableAccessor {
    _value: any;
    path: Array<any>;
    constructor(_value: any, path?: any);
    containerType(): "primitive" | "array" | "object";
    get(): any;
    length(): number;
    getIndex(i: number): any;
    hasAttribute(key: string): boolean;
    attributeKeys(): Array<string>;
    getAttribute(key: string): any;
    set(value: any): ImmutableAccessor;
    setAccessor(accessor: any): any;
    setIndex(i: number, value: any): ImmutableAccessor;
    setIndexAccessor(i: number, accessor: any): ImmutableAccessor;
    unsetIndices(indices: Array<number>): ImmutableAccessor;
    insertItemsAt(pos: number, items: Array<any>): ImmutableAccessor;
    setAttribute(key: string, value: any): ImmutableAccessor;
    setAttributeAccessor(key: string, accessor: any): ImmutableAccessor;
    unsetAttribute(key: string): ImmutableAccessor;
    mutate(fn: Function): ImmutableAccessor;
}
//# sourceMappingURL=ImmutableAccessor.d.ts.map