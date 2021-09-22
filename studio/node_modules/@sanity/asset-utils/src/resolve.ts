import {getDefaultCrop, getDefaultHotspot} from './hotspotCrop'
import {getForgivingResolver, UnresolvableError} from './utils'
import {parseImageAssetId, parseFileAssetId} from './parse'
import {
  isAssetIdStub,
  isAssetObjectStub,
  isAssetPathStub,
  isAssetUrlStub,
  isReference,
  ResolvedSanityFile,
  ResolvedSanityImage,
  SanityAssetSource,
  SanityFileAsset,
  SanityFileObjectStub,
  SanityFileSource,
  SanityImageAsset,
  SanityImageDimensions,
  SanityImageObjectStub,
  SanityImageSource,
  SanityProjectDetails,
} from './types'
import {
  cdnUrl,
  dummyProject,
  fileAssetFilenamePattern,
  idPattern,
  imageAssetFilenamePattern,
  pathPattern,
} from './constants'
import {
  buildFilePath,
  buildFileUrl,
  buildImagePath,
  buildImageUrl,
  getUrlPath,
  tryGetAssetPath,
} from './paths'

/**
 * Returns the width, height and aspect ratio of a passed image asset, from any
 * inferrable structure (id, url, path, asset document, image object etc)
 *
 * @param src - Input source (image object, asset, reference, id, url, path)
 * @returns Object with width, height and aspect ratio properties
 *
 * @throws {@link UnresolvableError}
 * Throws if passed image source could not be resolved to an asset ID
 */
export function getImageDimensions(src: SanityImageSource): SanityImageDimensions {
  const imageId = getAssetDocumentId(src)
  const {width, height} = parseImageAssetId(imageId)
  const aspectRatio = width / height
  return {width, height, aspectRatio}
}

/**
 * See {@link getImageDimensions}
 *
 * @inheritFrom {@link getImageDimensions}
 * @returns Returns `undefined` instead of throwing if a value cannot be resolved
 */
export const tryGetImageDimensions = getForgivingResolver(getImageDimensions)

/**
 * Returns the file extension for a given asset
 *
 * @param src - Input source (file/image object, asset, reference, id, url, path)
 * @returns The file extension, if resolvable (no `.` included)
 *
 * @throws {@link UnresolvableError}
 * Throws if passed asset source could not be resolved to an asset ID
 */
export function getExtension(src: SanityAssetSource): string {
  return isFileSource(src)
    ? getFile(src, dummyProject).asset.extension
    : getImage(src, dummyProject).asset.extension
}

/**
 * See {@link getExtension}
 *
 * @inheritFrom {@link getExtension}
 * @returns Returns `undefined` instead of throwing if a value cannot be resolved
 */
export const tryGetExtension = getForgivingResolver(getExtension)

/**
 * Tries to resolve an image object with as much information as possible,
 * from any inferrable structure (id, url, path, image object etc)
 *
 * @param src - Input source (image object, asset, reference, id, url, path)
 * @param project Project ID and dataset the image belongs to
 * @returns Image object
 *
 * @throws {@link UnresolvableError}
 * Throws if passed image source could not be resolved to an asset ID
 */
export function getImage(
  src: SanityImageSource,
  project?: SanityProjectDetails
): ResolvedSanityImage {
  const projectDetails = project || tryGetProject(src)
  const asset = getImageAsset(src, projectDetails)

  const img = src as SanityImageObjectStub
  return {
    asset,
    crop: img.crop || getDefaultCrop(),
    hotspot: img.hotspot || getDefaultHotspot(),
  }
}

/**
 * See {@link getImage}
 *
 * @inheritFrom {@link getImage}
 * @returns Returns `undefined` instead of throwing if a value cannot be resolved
 */
export const tryGetImage = getForgivingResolver(getImage)

/**
 * Tries to resolve a (partial) image asset document with as much information as possible,
 * from any inferrable structure (id, url, path, image object etc)
 *
 * @param src - Input source (image object, asset, reference, id, url, path)
 * @param project - Project ID and dataset the image belongs to
 * @returns Image asset document
 *
 * @throws {@link UnresolvableError}
 * Throws if passed image source could not be resolved to an asset ID
 */
export function getImageAsset(
  src: SanityImageSource,
  project?: SanityProjectDetails
): SanityImageAsset {
  const projectDetails = project || getProject(src)

  const _id = getAssetDocumentId(src)
  const sourceObj = src as SanityImageObjectStub
  const source = (sourceObj.asset || src) as SanityImageAsset
  const metadata = source.metadata || {}
  const {assetId, width, height, extension} = parseImageAssetId(_id)
  const aspectRatio = width / height
  const baseAsset: SanityImageAsset = {
    _id,
    _type: 'sanity.imageAsset',
    assetId,
    extension,
    metadata: {
      ...metadata,
      dimensions: {width, height, aspectRatio},
    },

    // Placeholders, overwritten below
    url: '',
    path: '',
  }

  return {
    ...baseAsset,
    path: buildImagePath(baseAsset, projectDetails),
    url: buildImageUrl(baseAsset, projectDetails),
  }
}

/**
 * See {@link getImageAsset}
 *
 * @inheritFrom {@link getImageAsset}
 * @returns Returns `undefined` instead of throwing if a value cannot be resolved
 */
export const tryGetImageAsset = getForgivingResolver(getImageAsset)

/**
 * Tries to resolve an file object with as much information as possible,
 * from any inferrable structure (id, url, path, file object etc)
 *
 * @param src - Input source (file object, asset, reference, id, url, path)
 * @param project Project ID and dataset the file belongs to
 * @returns File object
 *
 * @throws {@link UnresolvableError}
 * Throws if passed file source could not be resolved to an asset ID
 */
export function getFile(src: SanityFileSource, project?: SanityProjectDetails): ResolvedSanityFile {
  const projectDetails = project || tryGetProject(src)
  const asset = getFileAsset(src, projectDetails)
  return {asset}
}

/**
 * See {@link getFile}
 *
 * @inheritFrom {@link getFile}
 * @returns Returns `undefined` instead of throwing if a value cannot be resolved
 */
export const tryGetFile = getForgivingResolver(getFile)

/**
 * Tries to resolve a (partial) file asset document with as much information as possible,
 * from any inferrable structure (id, url, path, file object etc)
 *
 * @param src - Input source (file object, asset, reference, id, url, path)
 * @param project - Project ID and dataset the file belongs to
 * @returns File asset document
 *
 * @throws {@link UnresolvableError}
 * Throws if passed file source could not be resolved to an asset ID
 */
export function getFileAsset(
  src: SanityFileSource,
  project?: SanityProjectDetails
): SanityFileAsset {
  const projectDetails = project || getProject(src)

  const _id = getAssetDocumentId(src)
  const sourceObj = src as SanityFileObjectStub
  const source = (sourceObj.asset || src) as SanityFileAsset
  const {assetId, extension} = parseFileAssetId(_id)
  const baseAsset: SanityFileAsset = {
    _id,
    _type: 'sanity.fileAsset',
    assetId,
    extension,
    metadata: source.metadata || {},

    // Placeholders, overwritten below
    url: '',
    path: '',
  }

  return {
    ...baseAsset,
    path: buildFilePath(baseAsset, projectDetails),
    url: buildFileUrl(baseAsset, projectDetails),
  }
}

/**
 * See {@link getFileAsset}
 *
 * @inheritFrom {@link getFileAsset}
 * @returns Returns `undefined` instead of throwing if a value cannot be resolved
 */
export const tryGetFileAsset = getForgivingResolver(getFileAsset)

/**
 * Tries to resolve the asset document ID from any inferrable structure
 *
 * @param src - Input source (image/file object, asset, reference, id, url, path)
 * @returns The asset document ID
 *
 * @throws {@link UnresolvableError}
 * Throws if passed asset source could not be resolved to an asset document ID
 */
export function getAssetDocumentId(src: SanityAssetSource): string {
  const source = isAssetObjectStub(src) ? src.asset : src

  let id = ''
  if (typeof source === 'string') {
    id = getIdFromString(source)
  } else if (isReference(source)) {
    id = source._ref
  } else if (isAssetIdStub(source)) {
    id = source._id
  } else if (isAssetPathStub(source)) {
    id = idFromUrl(`${cdnUrl}/${source.path}`)
  } else if (isAssetUrlStub(source)) {
    id = idFromUrl(source.url)
  }

  const hasId = id && idPattern.test(id)
  if (!hasId) {
    throw new UnresolvableError(src)
  }

  return id
}

/**
 * See {@link getAssetDocumentId}
 *
 * @inheritFrom {@link getAssetDocumentId}
 * @returns Returns `undefined` instead of throwing if a value cannot be resolved
 */
export const tryGetAssetDocumentId = getForgivingResolver(getAssetDocumentId)

/**
 * Tries to cooerce a string (ID, URL or path) to an image asset ID
 *
 * @param str - Input string (ID, URL or path)
 * @returns string
 *
 *
 * @throws {@link UnresolvableError}
 * Throws if passed image source could not be resolved to an asset ID
 */
export function getIdFromString(str: string): string {
  if (idPattern.test(str)) {
    // Already an ID
    return str
  }

  if (str.indexOf(`${cdnUrl}/images`) === 0 || str.indexOf(`${cdnUrl}/files`) === 0) {
    // Full URL
    return idFromUrl(str)
  }

  if (pathPattern.test(str)) {
    // Path
    return idFromUrl(`${cdnUrl}/${str}`)
  }

  if (isFileAssetFilename(str)) {
    // Just a filename (projectId/dataset irrelevant: just need asset ID)
    return idFromUrl(`${cdnUrl}/files/a/b/${str}`)
  }

  if (isImageAssetFilename(str)) {
    // Just a filename (projectId/dataset irrelevant: just need asset ID)
    return idFromUrl(`${cdnUrl}/images/a/b/${str}`)
  }

  throw new UnresolvableError(str)
}

/**
 * See {@link getIdFromString}
 *
 * @inheritFrom {@link getIdFromString}
 * @returns Returns `undefined` instead of throwing if a value cannot be resolved
 */
export const tryGetIdFromString = getForgivingResolver(getIdFromString)

/**
 * Converts from a full asset URL to just the asset document ID
 *
 * @param url - A full asset URL to convert
 * @returns string
 */
function idFromUrl(url: string): string {
  const path = getUrlPath(url)
  const [type, , , fileName] = path.split('/')
  const prefix = type.replace(/s$/, '')
  return `${prefix}-${fileName.replace(/\./g, '-')}`
}

/**
 * Resolves project ID and dataset the image belongs to, based on full URL or path
 * @param source - Image URL or path
 * @returns object | undefined
 *
 * @throws {@link UnresolvableError}
 * Throws if passed image source could not be resolved to an asset ID
 */
export function getProject(src: SanityImageSource): SanityProjectDetails {
  const path = tryGetAssetPath(src)
  if (!path) {
    throw new UnresolvableError(src, 'Failed to resolve project ID and dataset from source')
  }

  const [, projectId, dataset] = path.match(pathPattern) || ([] as string[])
  if (!projectId || !dataset) {
    throw new UnresolvableError(src, 'Failed to resolve project ID and dataset from source')
  }

  return {projectId, dataset}
}

/**
 * See {@link getProject}
 *
 * @inheritFrom {@link getProject}
 * @returns Returns `undefined` instead of throwing if a value cannot be resolved
 */
export const tryGetProject = getForgivingResolver(getProject)

/**
 * Returns whether or not the passed filename is a valid image asset filename
 *
 * @param filename - Filename to validate
 * @returns Whether or not the filename is an image asset filename
 */
export function isImageAssetFilename(filename: string): boolean {
  return imageAssetFilenamePattern.test(filename)
}

/**
 * Returns whether or not the passed filename is a valid file asset filename
 *
 * @param filename - Filename to validate
 * @returns Whether or not the filename is a file asset filename
 */
export function isFileAssetFilename(filename: string): boolean {
  return fileAssetFilenamePattern.test(filename)
}

/**
 * Returns whether or not the passed filename is a valid file or image asset filename
 *
 * @param filename - Filename to validate
 * @returns Whether or not the filename is an asset filename
 */
export function isAssetFilename(filename: string): boolean {
  return isImageAssetFilename(filename) || isFileAssetFilename(filename)
}

/**
 * Return whether or not the passed source is a file source
 *
 * @param src - Source to check
 * @returns Whether or not the given source is a file source
 */
export function isFileSource(src: SanityAssetSource): src is SanityFileSource {
  const assetId = getAssetDocumentId(src)
  return assetId.startsWith('file-')
}

/**
 * Return whether or not the passed source is an image source
 *
 * @param src - Source to check
 * @returns Whether or not the given source is an image source
 */
export function isImageSource(src: SanityAssetSource): src is SanityImageSource {
  const assetId = getAssetDocumentId(src)
  return assetId.startsWith('image-')
}
