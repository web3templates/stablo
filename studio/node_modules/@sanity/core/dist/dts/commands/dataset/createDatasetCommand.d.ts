declare namespace _default {
    export const name: string;
    export const group: string;
    export const signature: string;
    export { helpText };
    export const description: string;
    export function action(args: any, context: any): Promise<void>;
}
export default _default;
declare const helpText: "\nOptions\n  --visibility <mode> Set visibility for this dataset (public/private)\n\nExamples\n  sanity dataset create\n  sanity dataset create <name>\n  sanity dataset create <name> --visibility private\n";
//# sourceMappingURL=createDatasetCommand.d.ts.map