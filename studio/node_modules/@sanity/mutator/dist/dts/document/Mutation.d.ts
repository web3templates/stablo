import { Doc, Mut } from './types';
export declare type MutationParams = {
    transactionId?: string;
    transition?: string;
    identity?: string;
    previousRev?: string;
    resultRev?: string;
    mutations: Array<Mut>;
    timestamp?: String;
    effects?: {
        apply: unknown;
        revert: unknown;
    };
};
export default class Mutation {
    params: MutationParams;
    compiled: Function;
    _appliesToMissingDocument: boolean;
    constructor(options: MutationParams);
    get transactionId(): string;
    get transition(): string;
    get identity(): string;
    get previousRev(): string;
    get resultRev(): string;
    get mutations(): Array<Mut>;
    get timestamp(): Date;
    get effects(): {
        apply: unknown;
        revert: unknown;
    };
    assignRandomTransactionId(): void;
    appliesToMissingDocument(): boolean;
    compile(): void;
    apply(document: Doc): Doc;
    static applyAll(document: Doc, mutations: Array<Mutation>): Doc;
    static squash(document: Doc, mutations: Array<Mutation>): Mutation;
}
//# sourceMappingURL=Mutation.d.ts.map