declare namespace _default {
    export const name: string;
    export const group: string;
    export const signature: string;
    export const description: string;
    export { helpText };
    export function action(args: any, context: any): Promise<void>;
}
export default _default;
declare const helpText: "\nOptions\n  --raw                     Extract only documents, without rewriting asset references\n  --no-assets               Export only non-asset documents and remove references to image assets\n  --no-drafts               Export only published versions of documents\n  --no-compress             Skips compressing tarball entries (still generates a gzip file)\n  --types                   Defines which document types to export\n  --overwrite               Overwrite any file with the same name\n  --asset-concurrency <num> Concurrent number of asset downloads\n\nExamples\n  sanity dataset export moviedb localPath.tar.gz\n  sanity dataset export moviedb assetless.tar.gz --no-assets\n  sanity dataset export staging staging.tar.gz --raw\n  sanity dataset export staging staging.tar.gz --types products,shops\n";
//# sourceMappingURL=exportDatasetCommand.d.ts.map