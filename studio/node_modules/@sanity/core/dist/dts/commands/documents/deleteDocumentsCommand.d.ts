declare namespace _default {
    export const name: string;
    export const group: string;
    export const signature: string;
    export { helpText };
    export const description: string;
    export function action(args: any, context: any): Promise<void>;
}
export default _default;
declare const helpText: "\nDelete a document from the projects configured dataset\n\nOptions\n  --dataset NAME to override dataset\n\nExample\n  # Delete the document with the ID \"myDocId\"\n  sanity documents delete myDocId\n\n  # ID wrapped in double or single quote works equally well\n  sanity documents delete 'myDocId'\n\n  # Delete document with ID \"someDocId\" from dataset \"blog\"\n  sanity documents delete --dataset=blog someDocId\n\n  # Delete the document with ID \"doc1\" and \"doc2\"\n  sanity documents delete doc1 doc2\n";
//# sourceMappingURL=deleteDocumentsCommand.d.ts.map