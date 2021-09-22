import Mutation from './Mutation';
import { Doc } from './types';
declare type SubmissionResponder = {
    success: Function;
    failure: Function;
};
export default class Document {
    incoming: Array<Mutation>;
    submitted: Array<Mutation>;
    pending: Array<Mutation>;
    HEAD: Doc;
    EDGE: Doc;
    onRebase: Function;
    onMutation: Function;
    onConsistencyChanged: Function;
    onRemoteMutation?: (mut: Mutation) => void;
    inconsistentAt: Date | null;
    lastStagedAt: Date;
    constructor(doc: Doc);
    reset(doc: Doc): void;
    arrive(mutation: Mutation): void;
    stage(mutation: Mutation, silent?: boolean): SubmissionResponder;
    isConsistent(): boolean;
    considerIncoming(): void;
    updateConsistencyFlag(): void;
    applyIncoming(mut: Mutation): boolean;
    anyUnresolvedMutations(): boolean;
    consumeUnresolved(txnId: string): boolean;
    pendingSuccessfullySubmitted(pendingTxnId: string): void;
    pendingFailed(pendingTxnId: string): void;
    rebase(incomingMutations: Mutation[]): void;
}
export {};
//# sourceMappingURL=Document.d.ts.map