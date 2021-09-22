declare namespace _default {
    export const name: string;
    export const group: string;
    export const signature: string;
    export const description: string;
    export { helpText };
    export function action(args: any, context: any): Promise<void>;
}
export default _default;
declare const helpText: "\nOptions\n  --missing On duplicate document IDs, skip importing document in question\n  --replace On duplicate document IDs, replace existing document with imported document\n  --allow-failing-assets Skip assets that cannot be fetched/uploaded\n  --replace-assets Skip reuse of existing assets\n\nRarely used options (should generally not be used)\n  --allow-assets-in-different-dataset Allow asset documents to reference different project/dataset\n\nExamples\n  # Import \"moviedb.ndjson\" from the current directory to the dataset called \"moviedb\"\n  sanity dataset import moviedb.ndjson moviedb\n\n  # Import \"moviedb.tar.gz\" from the current directory to the dataset called \"moviedb\",\n  # replacing any documents encountered that have the same document IDs\n  sanity dataset import moviedb.tar.gz moviedb --replace\n\n  # Import from a folder containing an ndjson file, such as an extracted tarball\n  # retrieved through \"sanity dataset export\".\n  sanity dataset import ~/some/folder moviedb\n\n  # Import from a remote URL. Will download and extract the tarball to a temporary\n  # location before importing it.\n  sanity dataset import https://some.url/moviedb.tar.gz moviedb --replace\n";
//# sourceMappingURL=importDatasetCommand.d.ts.map