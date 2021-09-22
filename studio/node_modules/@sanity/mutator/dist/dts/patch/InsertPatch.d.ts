export default class InsertPatch {
    location: string;
    path: string;
    items: Array<any>;
    id: string;
    constructor(id: string, location: string, path: string, items: Array<any>);
    apply(targets: any, accessor: any): any;
}
//# sourceMappingURL=InsertPatch.d.ts.map