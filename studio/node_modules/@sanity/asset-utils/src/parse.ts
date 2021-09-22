import {SanityAssetIdParts, SanityFileAssetIdParts, SanityImageAssetIdParts} from './types'
import {fileAssetIdPattern, imageAssetFilenamePattern, imageAssetIdPattern} from './constants'
import {tryGetUrlFilename, isValidFilename} from './paths'

/**
 * @internal
 */
const exampleFileId = 'file-027401f31c3ac1e6d78c5d539ccd1beff72b9b11-pdf'

/**
 * @internal
 */
const exampleImageId = 'image-027401f31c3ac1e6d78c5d539ccd1beff72b9b11-2000x3000-jpg'

/**
 * Parses a Sanity asset document ID into individual parts (type, id, extension, width/height etc)
 *
 * @param documentId - Document ID to parse into named parts
 * @returns Object of named properties
 * @throws If document ID is invalid
 */
export function parseAssetId(documentId: string): SanityAssetIdParts {
  if (imageAssetIdPattern.test(documentId)) {
    return parseImageAssetId(documentId)
  }

  if (fileAssetIdPattern.test(documentId)) {
    return parseFileAssetId(documentId)
  }

  throw new Error(`Invalid image/file asset ID: ${documentId}`)
}

/**
 * Parses a Sanity file asset document ID into individual parts (type, id, extension)
 *
 * @param documentId - File asset document ID to parse into named parts
 * @returns Object of named properties
 * @throws If document ID invalid
 */
export function parseFileAssetId(documentId: string): SanityFileAssetIdParts {
  if (!fileAssetIdPattern.test(documentId)) {
    throw new Error(
      `Malformed file asset ID '${documentId}'. Expected an id like "${exampleFileId}"`
    )
  }

  const [, assetId, extension] = documentId.split('-')
  return {type: 'file', assetId, extension}
}

/**
 * Parses a Sanity image asset document ID into individual parts (type, id, extension, width, height)
 *
 * @param documentId - Image asset document ID to parse into named parts
 * @returns Object of named properties
 * @throws If document ID invalid
 */
export function parseImageAssetId(documentId: string): SanityImageAssetIdParts {
  const [, assetId, dimensionString, extension] = documentId.split('-')
  const [width, height] = (dimensionString || '').split('x').map(Number)

  if (!assetId || !dimensionString || !extension || !(width > 0) || !(height > 0)) {
    throw new Error(`Malformed asset ID '${documentId}'. Expected an id like "${exampleImageId}".`)
  }

  return {type: 'image', assetId, width, height, extension}
}

/**
 * Parses a Sanity asset filename into individual parts (type, id, extension, width, height)
 *
 * @param filename - Filename to parse into named parts
 * @returns Object of named properties
 * @throws If image/filename is invalid
 */
export function parseAssetFilename(filename: string): SanityAssetIdParts {
  const file = tryGetUrlFilename(filename) || ''
  if (!isValidFilename(file)) {
    throw new Error(`Invalid image/file asset filename: ${filename}`)
  }

  try {
    const type = imageAssetFilenamePattern.test(file) ? 'image' : 'file'
    const assetId = file.replace(/\.([a-z0-9+]+)$/i, '-$1')
    return parseAssetId(`${type}-${assetId}`)
  } catch (err) {
    throw new Error(`Invalid image/file asset filename: ${filename}`)
  }
}
