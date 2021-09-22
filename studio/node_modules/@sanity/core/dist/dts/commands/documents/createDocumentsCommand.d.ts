declare namespace _default {
    export const name: string;
    export const group: string;
    export const signature: string;
    export { helpText };
    export const description: string;
    export function action(args: any, context: any): Promise<void>;
}
export default _default;
declare const helpText: "\nOptions\n  --replace On duplicate document IDs, replace existing document with specified document(s)\n  --missing On duplicate document IDs, don't modify the target document(s)\n  --watch   Write the documents whenever the target file or buffer changes\n  --json5   Use JSON5 file type to allow a \"simplified\" version of JSON\n  --id <id> Specify a document ID to use. Will fetch remote document ID and populate editor.\n  --dataset NAME to override dataset\n\nExamples\n  # Create the document specified in \"myDocument.json\".\n  sanity documents create myDocument.json\n\n  # Open configured $EDITOR and create the specified document(s)\n  sanity documents create\n\n  # Fetch document with the ID \"myDocId\" and open configured $EDITOR with the\n  # current document content (if any). Replace document with the edited version\n  # when the editor closes\n  sanity documents create --id myDocId --replace\n\n  # Open configured $EDITOR and replace the document with the given content\n  # on each save. Use JSON5 file extension and parser for simplified syntax.\n  sanity documents create --id myDocId --watch --replace --json5\n";
//# sourceMappingURL=createDocumentsCommand.d.ts.map