export function formatFailure(attempt: any, { includeHelp }?: {
    includeHelp: any;
}): string;
export function getStatus(attempt: any): "Failed" | "In progress" | "Delivered";
declare namespace _default {
    const name: string;
    const group: string;
    const signature: string;
    const description: string;
    function action(args: any, context: any): Promise<void>;
}
export default _default;
//# sourceMappingURL=printHookAttemptCommand.d.ts.map