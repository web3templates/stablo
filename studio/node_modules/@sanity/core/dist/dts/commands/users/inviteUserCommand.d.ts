declare namespace _default {
    export const name: string;
    export const group: string;
    export const signature: string;
    export { helpText };
    export const description: string;
    export function action(args: any, context: any): Promise<void>;
}
export default _default;
declare const helpText: "\nOptions\n  --role Role to invite the user as\n\nExamples\n  # Invite a new user to the project (prompt for details)\n  sanity users invite\n\n  # Send a new user invite to the email \"pippi@sanity.io\", prompt for role\n  sanity users invite pippi@sanity.io\n\n  # Send a new user invite to the email \"pippi@sanity.io\", as administrator\n  sanity users invite pippi@sanity.io --role administrator\n";
//# sourceMappingURL=inviteUserCommand.d.ts.map