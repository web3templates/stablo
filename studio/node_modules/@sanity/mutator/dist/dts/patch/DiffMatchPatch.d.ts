import * as DMP from 'diff-match-patch';
export default class DiffMatchPatch {
    path: string;
    dmpPatch: DMP.patch_obj[];
    id: string;
    constructor(id: string, path: string, dmpPatchSrc: string);
    apply(targets: any, accessor: any): any;
}
//# sourceMappingURL=DiffMatchPatch.d.ts.map