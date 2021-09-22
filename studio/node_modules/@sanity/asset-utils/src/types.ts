export type SanityAssetIdParts = SanityFileAssetIdParts | SanityImageAssetIdParts

export interface SanityFileAssetIdParts {
  type: 'file'
  assetId: string
  extension: string
}

export type SanityImageAssetIdParts = {
  type: 'image'
  assetId: string
  extension: string
  width: number
  height: number
}

export type SanityAssetSource = SanityFileSource | SanityImageSource

export type SanityFileSource =
  | string
  | SanityReference
  | SanityFileAsset
  | SanityAssetIdStub
  | SanityAssetUrlStub
  | SanityAssetPathStub
  | SanityFileObjectStub

export type SanityImageSource =
  | string
  | SanityReference
  | SanityImageAsset
  | SanityAssetIdStub
  | SanityAssetUrlStub
  | SanityAssetPathStub
  | SanityImageObjectStub

export type SanitySwatchName =
  | 'darkMuted'
  | 'darkVibrant'
  | 'dominant'
  | 'lightMuted'
  | 'lightVibrant'
  | 'muted'
  | 'vibrant'

export interface Rectangle {
  x: number
  y: number
  width: number
  height: number
}

export interface AbsoluteRectangle {
  top: number
  left: number
  right: number
  bottom: number
}

export interface SanityProjectDetails {
  projectId: string
  dataset: string
}

export interface ImageUrlBuilderOptions {
  assetId: string
  extension: string
  metadata: {
    dimensions: {
      width: number
      height: number
    }
  }

  // Serves of aliases of eachother, prefers `vanityFilename` if both are set
  originalFilename?: string
  vanityFilename?: string
}

export interface FileUrlBuilderOptions {
  assetId: string
  extension: string

  // Serves of aliases of eachother, prefers `vanityFilename` if both are set
  originalFilename?: string
  vanityFilename?: string
}

export interface SanityReference {
  _ref: string
  _weak?: boolean
}

/**
 * Checks whether or not the given source is a Sanity reference
 * (an object containing _ref string key)
 *
 * @param ref - Possible reference
 * @returns Whether or not the passed object is a reference
 */
export function isReference(ref: unknown): ref is SanityReference {
  return isObject(ref) && typeof (ref as SanityReference)._ref === 'string'
}

export interface SanityAssetIdStub {
  _id: string
}

/**
 * Checks whether or not the given source is an asset ID stub
 * (an object containing an `_id` property)
 *
 * @param stub - Possible asset id stub
 * @returns Whether or not the passed object is an object id stub
 */
export function isAssetIdStub(stub: unknown): stub is SanityAssetIdStub {
  return isObject(stub) && typeof (stub as SanityAssetIdStub)._id === 'string'
}

export interface SanityAssetPathStub {
  path: string
}

/**
 * Checks whether or not the given source is an asset path stub
 * (an object containing a `path` property)
 *
 * @param stub - Possible asset path stub
 * @returns Whether or not the passed object is an object path stub
 */
export function isAssetPathStub(stub: unknown): stub is SanityAssetPathStub {
  return isObject(stub) && typeof (stub as SanityAssetPathStub).path === 'string'
}

export interface SanityAssetUrlStub {
  url: string
}

/**
 * Checks whether or not the given source is an asset URL stub
 * (an object containing a `url` property)
 *
 * @param stub - Possible asset url stub
 * @returns Whether or not the passed object is an object url stub
 */
export function isAssetUrlStub(stub: unknown): stub is SanityAssetUrlStub {
  return isObject(stub) && typeof (stub as SanityAssetUrlStub).url === 'string'
}

export interface SanityAsset {
  _id: string
  _type: string
  url: string
  path: string
  assetId: string
  extension: string
  originalFilename?: string
}

export type SanityImageAsset = SanityAsset & {
  _type: 'sanity.imageAsset'
  metadata: SanityImageMetadata
}

export type SanityFileAsset = SanityAsset & {
  _type: 'sanity.fileAsset'
  metadata: {[key: string]: unknown}
}

/**
 * Checks whether or not the given source is a (partial) sanity file asset document.
 * Only checks the `_type` property, all other properties _may_ be missing
 *
 * @param src - Source to check
 * @returns Whether or not the given source is a file asset
 */
export function isSanityFileAsset(src: unknown): src is SanityFileAsset {
  return isObject(src) && (src as SanityFileAsset)._type === 'sanity.fileAsset'
}

export interface SanityImageMetadata {
  dimensions: SanityImageDimensions
  lqip?: string
  palette?: SanityImagePalette
  [key: string]: unknown
}

export interface SanityImageSize {
  height: number
  width: number
}

export type SanityImageDimensions = SanityImageSize & {
  aspectRatio: number
}

export interface SanityImageCrop {
  _type?: string
  left: number
  bottom: number
  right: number
  top: number
}

export interface SanityImageHotspot {
  _type?: string
  width: number
  height: number
  x: number
  y: number
}

export interface SanityFileObjectStub {
  _type?: string
  asset:
    | SanityReference
    | SanityFileAsset
    | SanityAssetIdStub
    | SanityAssetPathStub
    | SanityAssetUrlStub
  [key: string]: unknown
}

export interface SanityImageObjectStub {
  _type?: string
  asset:
    | SanityReference
    | SanityImageAsset
    | SanityAssetIdStub
    | SanityAssetPathStub
    | SanityAssetUrlStub
  crop?: SanityImageCrop
  hotspot?: SanityImageHotspot
  [key: string]: unknown
}

export interface ResolvedSanityImage {
  _type?: string
  asset: SanityImageAsset
  crop: SanityImageCrop
  hotspot: SanityImageHotspot
  [key: string]: unknown
}

export interface ResolvedSanityFile {
  _type?: string
  asset: SanityFileAsset
  [key: string]: unknown
}

export type SanityAssetObjectStub = SanityFileObjectStub | SanityImageObjectStub

/**
 * Checks whether or not the given source is an asset object stub
 *
 * @param stub - Possible asset object stub
 * @returns Whether or not the passed object is an object stub
 */
export function isAssetObjectStub(stub: unknown): stub is SanityAssetObjectStub {
  const item = stub as SanityAssetObjectStub
  return isObject(item) && item.asset && typeof item.asset === 'object'
}

export interface SanityImagePalette {
  _type?: string
  darkMuted?: SanityImageSwatch
  darkVibrant?: SanityImageSwatch
  dominant?: SanityImageSwatch
  lightMuted?: SanityImageSwatch
  lightVibrant?: SanityImageSwatch
  muted?: SanityImageSwatch
  vibrant?: SanityImageSwatch
  [key: string]: unknown
}

export interface SanityImageSwatch {
  background: string
  foreground: string
  population: number
  title?: string
}

export interface SanityImageFitResult {
  width?: number
  height?: number
  rect: Rectangle
}

/**
 * Checks whether or not the passed object is an object (and not `null`)
 *
 * @param obj Item to check whether or not is an object
 * @returns Whether or not `obj` is an object
 * @internal
 */
export function isObject(obj: unknown): obj is object {
  return obj !== null && !Array.isArray(obj) && typeof obj === 'object'
}
