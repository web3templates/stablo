import { Probe } from './Descender';
export declare type Expr = any;
export declare type Range = {
    start: number;
    end: number;
    step: number;
};
export default class Expression {
    expr: Expr;
    constructor(expr: Expr);
    isPath(): boolean;
    isUnion(): boolean;
    isCollection(): boolean;
    isConstraint(): boolean;
    isRecursive(): boolean;
    isExistenceConstraint(): boolean;
    isIndex(): boolean;
    isRange(): boolean;
    expandRange(probe: Probe): Range;
    isAttributeReference(): boolean;
    isIndexReference(): boolean;
    name(): string;
    isSelfReference(): boolean;
    constraintTargetIsSelf(): boolean;
    constraintTargetIsAttribute(): boolean;
    testConstraint(probe: Probe): boolean;
    pathNodes(): any;
    prepend(node: any): Expression;
    concat(other: any): any;
    descend(): {
        head: Expression;
        tail: Expression;
    }[];
    unwrapRecursive(): Expression;
    toIndicies(probe?: Probe): Array<number>;
    toFieldReferences(): Array<any>;
    toString(): string;
    static fromPath(path: string): Expression;
    static attributeReference(name: string): Expression;
    static indexReference(i: number): Expression;
}
//# sourceMappingURL=Expression.d.ts.map