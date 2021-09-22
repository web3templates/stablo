declare namespace _default {
    export const name: string;
    export const group: string;
    export const signature: string;
    export { helpText };
    export const description: string;
    export function action(args: any, context: any): Promise<void>;
}
export default _default;
declare const helpText: "\nExamples\n  sanity cors delete\n  sanity cors delete http://localhost:3000\n";
//# sourceMappingURL=deleteCorsOriginCommand.d.ts.map