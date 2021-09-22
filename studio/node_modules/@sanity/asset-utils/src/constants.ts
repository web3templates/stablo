/**
 * @internal
 */
export const cdnUrl = 'https://cdn.sanity.io'

/**
 * @internal
 */
export const fileAssetFilenamePattern = /^([a-zA-Z0-9_]{24,40}|[a-f0-9]{40})+\.[a-z0-9]+$/

/**
 * @internal
 */
export const fileAssetIdPattern = /^file-[a-zA-Z0-9_]+-[a-z0-9]+$/

/**
 * @internal
 */
export const imageAssetFilenamePattern = /^([a-zA-Z0-9_]{24,40}|[a-f0-9]{40})-\d+x\d+\.[a-z0-9]+$/

/**
 * @internal
 */
export const imageAssetIdPattern = /^image-[a-zA-Z0-9_]+-\d+x\d+-[a-z0-9]+$/

/**
 * @internal
 */
export const assetFilenamePattern = /^([a-zA-Z0-9_]+\.[a-z0-9]+|[a-zA-Z0-9_]+-\d+x\d+\.[a-z0-9]+)$/

/**
 * @internal
 */
export const pathPattern = /^(?:images|files)\/([a-z0-9]+)\/([a-z0-9][-\w]*)\//

/**
 * @internal
 */
export const idPattern = /^(?:image-[a-zA-Z0-9_]+-\d+x\d+-[a-z0-9]+|file-[a-zA-Z0-9_]+-[a-z0-9]+)$/

/**
 * For use in cases where the project and dataset doesn't really matter
 *
 * @internal
 */
export const dummyProject = {projectId: 'a', dataset: 'b'}
