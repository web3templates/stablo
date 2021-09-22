export = extractFromSanitySchema;
declare function extractFromSanitySchema(sanitySchema: any, extractOptions?: {}): {
    types: any;
    interfaces: {
        kind: string;
        name: string;
        description: string;
        fields: {
            fieldName: string;
            type: string;
            isNullable: boolean;
            description: string;
        }[];
    }[];
};
//# sourceMappingURL=extractFromSanitySchema.d.ts.map