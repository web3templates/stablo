export declare type Patch = {
    id: string;
    path: string;
};
export default class Patcher {
    patches: Patch[];
    constructor(patch: {});
    apply(value: {}): any;
    applyViaAccessor(accessor: any): any;
}
//# sourceMappingURL=Patcher.d.ts.map