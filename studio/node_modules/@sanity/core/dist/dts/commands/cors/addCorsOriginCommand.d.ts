declare namespace _default {
    export const name: string;
    export const group: string;
    export const signature: string;
    export { helpText };
    export const description: string;
    export function action(args: any, context: any): Promise<void>;
}
export default _default;
declare const helpText: "\nOptions\n  --credentials Allow credentials (token/cookie) to be sent from this origin\n  --no-credentials Disallow credentials (token/cookie) to be sent from this origin\n\nExamples\n  sanity cors add\n  sanity cors add http://localhost:3000 --no-credentials\n";
//# sourceMappingURL=addCorsOriginCommand.d.ts.map