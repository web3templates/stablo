export = SchemaError;
declare class SchemaError extends Error {
    constructor(problemGroups: any);
    problemGroups: any;
    print(output: any): void;
}
//# sourceMappingURL=SchemaError.d.ts.map