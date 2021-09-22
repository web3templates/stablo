declare namespace _default {
    export const name: string;
    export const group: string;
    export const signature: string;
    export { helpText };
    export const description: string;
    export function action(args: any, context: any): Promise<void>;
}
export default _default;
declare const helpText: "\nGet and print a document from the projects configured dataset\n\nOptions\n  --pretty colorized JSON output\n  --dataset NAME to override dataset\n\nExamples\n  # Get the document with the ID \"myDocId\"\n  sanity documents get myDocId\n\n  # ID wrapped in double or single quote works equally well\n  sanity documents get 'myDocId'\n";
//# sourceMappingURL=getDocumentsCommand.d.ts.map