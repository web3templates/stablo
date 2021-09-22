import type { CliCommandContext } from '../types';
interface CheckResult {
    didInstall: boolean;
}
/**
 * Checks that the studio has declared and installed the required dependencies
 * needed by the Sanity modules. While we generally use regular, explicit
 * dependencies in modules, there are certain dependencies that are better
 * served being peer dependencies, such as react and styled-components.
 *
 * If these dependencies are not installed/declared, we want to prompt the user
 * whether or not to add them to `package.json` and install them using yarn/npm
 */
export declare function checkRequiredDependencies(context: CliCommandContext): Promise<CheckResult>;
export {};
//# sourceMappingURL=checkRequiredDependencies.d.ts.map