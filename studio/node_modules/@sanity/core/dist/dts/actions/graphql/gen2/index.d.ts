declare function _exports(extracted: any): {
    types: any;
    queries: {
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
    interfaces: any;
    generation: string;
};
export = _exports;
//# sourceMappingURL=index.d.ts.map