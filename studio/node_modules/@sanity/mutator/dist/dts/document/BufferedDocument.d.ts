import Document from './Document';
import Mutation from './Mutation';
import SquashingBuffer from './SquashingBuffer';
import { Doc } from './types';
declare class Commit {
    mutations: Mutation[];
    tries: number;
    resolve: () => {};
    reject: (error: Error) => {};
    constructor(mutations: any, { resolve, reject }: {
        resolve: any;
        reject: any;
    });
    apply(doc: Doc): Doc;
    squash(doc: Doc): Mutation;
}
export default class BufferedDocument {
    mutations: Mutation[];
    document: Document;
    LOCAL: Doc;
    commits: Array<Commit>;
    buffer: SquashingBuffer;
    onMutation: Function;
    onRemoteMutation?: Document['onRemoteMutation'];
    onRebase: Function;
    onDelete: Function;
    commitHandler: Function;
    committerRunning: boolean;
    onConsistencyChanged: (boolean: any) => void;
    constructor(doc: any);
    reset(doc: any): void;
    add(mutation: Mutation): void;
    arrive(mutation: Mutation): void;
    commit(): Promise<void>;
    performCommits(): void;
    _cycleCommitter(): void;
    handleDocRebase(msg: any, remoteMutations: any, localMutations: any): void;
    handleDocumentDeleted(): void;
    handleDocMutation(msg: any): void;
    rebase(remoteMutations: Mutation[], localMutations: Mutation[]): void;
    handleDocConsistencyChanged(isConsistent: boolean): void;
}
export {};
//# sourceMappingURL=BufferedDocument.d.ts.map