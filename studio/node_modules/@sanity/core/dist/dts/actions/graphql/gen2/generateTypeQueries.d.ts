export = generateTypeQueries;
declare function generateTypeQueries(types: any, sortings: any): {
    fieldName: string;
    type: string;
    constraints: {
        field: string;
        comparator: string;
        value: {
            kind: string;
            argName: string;
        };
    }[];
    args: {
        name: string;
        description: string;
        type: string;
        isNullable: boolean;
    }[];
}[];
//# sourceMappingURL=generateTypeQueries.d.ts.map