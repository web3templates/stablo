declare namespace _default {
    export const name: string;
    export const signature: string;
    export const description: string;
    export const action: any;
    export { helpText };
}
export default _default;
declare const helpText: "\nOptions\n  --source-maps Enable source maps for built bundles (increases size of bundle)\n  --no-minify Skip minifying built JavaScript (speeds up build, increases size of bundle)\n  --no-build Don't build the studio prior to deploy, instead deploying the version currently in `dist/`\n\nExamples\n  sanity deploy\n  sanity deploy --no-minify --source-maps\n";
//# sourceMappingURL=deployCommand.d.ts.map