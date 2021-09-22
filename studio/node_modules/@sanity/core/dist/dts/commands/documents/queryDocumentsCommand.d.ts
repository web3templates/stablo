import type { CliCommandArguments, CliCommandContext } from '../../types';
interface CliQueryCommandFlags {
    pretty?: boolean;
    dataset?: string;
    apiVersion?: string;
}
declare const _default: {
    name: string;
    group: string;
    signature: string;
    helpText: string;
    description: string;
    action: (args: CliCommandArguments<CliQueryCommandFlags>, context: CliCommandContext) => Promise<void>;
};
export default _default;
//# sourceMappingURL=queryDocumentsCommand.d.ts.map