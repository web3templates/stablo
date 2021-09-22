import Descender, { Probe } from './Descender';
declare type Result = {
    leads: any[];
    delivery?: any;
};
export default class Matcher {
    active: Array<Descender>;
    recursives: Array<Descender>;
    payload: any;
    constructor(active: Array<Descender>, parent?: Matcher);
    setPayload(payload: any): this;
    extractRecursives(): void;
    activeRecursives(probe: Probe): Array<Descender>;
    match(probe: Probe): Object;
    iterate(probe: Probe): Matcher;
    isDestination(): boolean;
    hasRecursives(): boolean;
    extractMatches(probe: Probe): Result;
    static fromPath(jsonpath: string): Matcher;
}
export {};
//# sourceMappingURL=Matcher.d.ts.map