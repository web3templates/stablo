export = createStringFilters;
declare function createStringFilters(): {
    name: string;
    kind: string;
    isConstraintFilter: boolean;
    fields: ({
        fieldName: string;
        type: string;
        description: string;
        kind?: undefined;
        children?: undefined;
    } | {
        fieldName: string;
        kind: string;
        children: {
            type: string;
            isNullable: boolean;
        };
        description: string;
        type?: undefined;
    })[];
};
//# sourceMappingURL=stringFilters.d.ts.map