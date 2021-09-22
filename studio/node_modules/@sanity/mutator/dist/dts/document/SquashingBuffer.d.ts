import * as DiffMatchPatch from 'diff-match-patch';
import Mutation from './Mutation';
import { Doc, Mut } from './types';
export default class SquashingBuffer {
    BASIS: Doc;
    out: Array<any>;
    PRESTAGE: Doc;
    setOperations: Object;
    documentPresent: boolean;
    staged: Array<any>;
    dmp: DiffMatchPatch.diff_match_patch;
    constructor(doc: Doc);
    add(mut: Mutation): void;
    hasChanges(): boolean;
    purge(txnId?: string): Mutation;
    addOperation(op: Mut): void;
    optimiseSetOperation(path: string, nextValue: any): boolean;
    stashStagedOperations(): void;
    rebase(newBasis: Doc): Doc;
}
//# sourceMappingURL=SquashingBuffer.d.ts.map