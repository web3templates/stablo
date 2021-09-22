declare var _default: ({
    name: string;
    signature: string;
    description: string;
    action: any;
    helpText: string;
} | {
    name: string;
    signature: string;
    isGroupRoot: boolean;
    description: string;
} | {
    name: string;
    signature: string;
    description: string;
    action: (args: any, context: any) => any;
} | {
    name: string;
    group: string;
    description: string;
    action: any;
    helpText: string;
})[];
export default _default;
//# sourceMappingURL=index.d.ts.map