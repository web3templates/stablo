<!-- This file is AUTO-GENERATED, edit README.template.md or tweak scripts/generateReadme.js -->

# @sanity/asset-utils

Reusable utility functions for dealing with image and file assets in Sanity

## Installing

```sh
$ npm install @sanity/asset-utils
```

## Usage

```js
// ESM / TypeScript
import {someUtilityFunction} from '@sanity/asset-utils'

// CommonJS
const {someUtilityFunction} = require('@sanity/asset-utils')
```

## Documentation

An [HTML version](https://sanity-io.github.io/asset-utils/) is also available, which also includes interface definitions, constants and more.

### Functions

- [buildFilePath](README.md#buildfilepath)
- [buildFileUrl](README.md#buildfileurl)
- [buildImagePath](README.md#buildimagepath)
- [buildImageUrl](README.md#buildimageurl)
- [getAssetDocumentId](README.md#getassetdocumentid)
- [getDefaultCrop](README.md#getdefaultcrop)
- [getDefaultHotspot](README.md#getdefaulthotspot)
- [getExtension](README.md#getextension)
- [getFile](README.md#getfile)
- [getFileAsset](README.md#getfileasset)
- [getIdFromString](README.md#getidfromstring)
- [getImage](README.md#getimage)
- [getImageAsset](README.md#getimageasset)
- [getImageDimensions](README.md#getimagedimensions)
- [getProject](README.md#getproject)
- [getUrlFilename](README.md#geturlfilename)
- [getUrlPath](README.md#geturlpath)
- [hasPath](README.md#haspath)
- [idFromUrl](README.md#idfromurl)
- [isAssetFilename](README.md#isassetfilename)
- [isAssetIdStub](README.md#isassetidstub)
- [isAssetObjectStub](README.md#isassetobjectstub)
- [isAssetPathStub](README.md#isassetpathstub)
- [isAssetUrlStub](README.md#isasseturlstub)
- [isDefaultCrop](README.md#isdefaultcrop)
- [isDefaultHotspot](README.md#isdefaulthotspot)
- [isFileAssetFilename](README.md#isfileassetfilename)
- [isFileSource](README.md#isfilesource)
- [isImageAssetFilename](README.md#isimageassetfilename)
- [isImageSource](README.md#isimagesource)
- [isReference](README.md#isreference)
- [isSanityFileAsset](README.md#issanityfileasset)
- [isUnresolvableError](README.md#isunresolvableerror)
- [isValidFilename](README.md#isvalidfilename)
- [parseAssetFilename](README.md#parseassetfilename)
- [parseAssetId](README.md#parseassetid)
- [parseFileAssetId](README.md#parsefileassetid)
- [parseImageAssetId](README.md#parseimageassetid)
- [tryGetAssetDocumentId](README.md#trygetassetdocumentid)
- [tryGetAssetPath](README.md#trygetassetpath)
- [tryGetExtension](README.md#trygetextension)
- [tryGetFile](README.md#trygetfile)
- [tryGetFileAsset](README.md#trygetfileasset)
- [tryGetIdFromString](README.md#trygetidfromstring)
- [tryGetImage](README.md#trygetimage)
- [tryGetImageAsset](README.md#trygetimageasset)
- [tryGetImageDimensions](README.md#trygetimagedimensions)
- [tryGetProject](README.md#trygetproject)
- [tryGetUrlFilename](README.md#trygeturlfilename)
- [tryGetUrlPath](README.md#trygeturlpath)

### buildFilePath

▸ **buildFilePath**(`asset`: [FileUrlBuilderOptions](https://sanity-io.github.io/asset-utils//interfaces/fileurlbuilderoptions.html), `project`: [SanityProjectDetails](https://sanity-io.github.io/asset-utils//interfaces/sanityprojectdetails.html)): _string_

Builds the base file path from the minimal set of parts required to assemble it

| Name      | Type                                                                                                    | Description                                               |
| --------- | ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `asset`   | [FileUrlBuilderOptions](https://sanity-io.github.io/asset-utils//interfaces/fileurlbuilderoptions.html) | An asset-like shape defining ID, dimensions and extension |
| `project` | [SanityProjectDetails](https://sanity-io.github.io/asset-utils//interfaces/sanityprojectdetails.html)   | Project ID and dataset the file belongs to                |

**Returns:** _string_

_Defined in [src/paths.ts:60](https://github.com/sanity-io/asset-utils/blob/63fef3b/src/paths.ts#L60)_

### buildFileUrl

▸ **buildFileUrl**(`asset`: [FileUrlBuilderOptions](https://sanity-io.github.io/asset-utils//interfaces/fileurlbuilderoptions.html), `project`: [SanityProjectDetails](https://sanity-io.github.io/asset-utils//interfaces/sanityprojectdetails.html)): _string_

Builds the base file URL from the minimal set of parts required to assemble it

| Name      | Type                                                                                                    | Description                                   |
| --------- | ------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| `asset`   | [FileUrlBuilderOptions](https://sanity-io.github.io/asset-utils//interfaces/fileurlbuilderoptions.html) | An asset-like shape defining ID and extension |
| `project` | [SanityProjectDetails](https://sanity-io.github.io/asset-utils//interfaces/sanityprojectdetails.html)   | Project ID and dataset the file belongs to    |

**Returns:** _string_

_Defined in [src/paths.ts:84](https://github.com/sanity-io/asset-utils/blob/63fef3b/src/paths.ts#L84)_

### buildImagePath

▸ **buildImagePath**(`asset`: [ImageUrlBuilderOptions](https://sanity-io.github.io/asset-utils//interfaces/imageurlbuilderoptions.html), `project`: [SanityProjectDetails](https://sanity-io.github.io/asset-utils//interfaces/sanityprojectdetails.html)): _string_

Builds the base image path from the minimal set of parts required to assemble it

| Name      | Type                                                                                                      | Description                                               |
| --------- | --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `asset`   | [ImageUrlBuilderOptions](https://sanity-io.github.io/asset-utils//interfaces/imageurlbuilderoptions.html) | An asset-like shape defining ID, dimensions and extension |
| `project` | [SanityProjectDetails](https://sanity-io.github.io/asset-utils//interfaces/sanityprojectdetails.html)     | Project ID and dataset the image belongs to               |

**Returns:** _string_

_Defined in [src/paths.ts:21](https://github.com/sanity-io/asset-utils/blob/63fef3b/src/paths.ts#L21)_

### buildImageUrl

▸ **buildImageUrl**(`asset`: [ImageUrlBuilderOptions](https://sanity-io.github.io/asset-utils//interfaces/imageurlbuilderoptions.html), `project`: [SanityProjectDetails](https://sanity-io.github.io/asset-utils//interfaces/sanityprojectdetails.html)): _string_

Builds the base image URL from the minimal set of parts required to assemble it

| Name      | Type                                                                                                      | Description                                               |
| --------- | --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `asset`   | [ImageUrlBuilderOptions](https://sanity-io.github.io/asset-utils//interfaces/imageurlbuilderoptions.html) | An asset-like shape defining ID, dimensions and extension |
| `project` | [SanityProjectDetails](https://sanity-io.github.io/asset-utils//interfaces/sanityprojectdetails.html)     | Project ID and dataset the image belongs to               |

**Returns:** _string_

_Defined in [src/paths.ts:46](https://github.com/sanity-io/asset-utils/blob/63fef3b/src/paths.ts#L46)_

### getAssetDocumentId

▸ **getAssetDocumentId**(`src`: [SanityAssetSource](https://sanity-io.github.io/asset-utils//index.html#sanityassetsource)): _string_

Tries to resolve the asset document ID from any inferrable structure

| Name  | Type                                                                                       | Description                                                       |
| ----- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| `src` | [SanityAssetSource](https://sanity-io.github.io/asset-utils//index.html#sanityassetsource) | Input source (image/file object, asset, reference, id, url, path) |

**Returns:** _string_

_Defined in [src/resolve.ts:256](https://github.com/sanity-io/asset-utils/blob/63fef3b/src/resolve.ts#L256)_

### getDefaultCrop

▸ **getDefaultCrop**(): _[SanityImageCrop](https://sanity-io.github.io/asset-utils//interfaces/sanityimagecrop.html)_

Returns cloned version of the default crop (prevents accidental mutations)

| Name | Type |
| ---- | ---- |


**Returns:** _[SanityImageCrop](https://sanity-io.github.io/asset-utils//interfaces/sanityimagecrop.html)_

_Defined in [src/hotspotCrop.ts:28](https://github.com/sanity-io/asset-utils/blob/63fef3b/src/hotspotCrop.ts#L28)_

### getDefaultHotspot

▸ **getDefaultHotspot**(): _[SanityImageHotspot](https://sanity-io.github.io/asset-utils//interfaces/sanityimagehotspot.html)_

Returns cloned version of the default hotspot (prevents accidental mutations)

| Name | Type |
| ---- | ---- |


**Returns:** _[SanityImageHotspot](https://sanity-io.github.io/asset-utils//interfaces/sanityimagehotspot.html)_

_Defined in [src/hotspotCrop.ts:35](https://github.com/sanity-io/asset-utils/blob/63fef3b/src/hotspotCrop.ts#L35)_

### getExtension

▸ **getExtension**(`src`: [SanityAssetSource](https://sanity-io.github.io/asset-utils//index.html#sanityassetsource)): _string_

Returns the file extension for a given asset

| Name  | Type                                                                                       | Description                                                       |
| ----- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| `src` | [SanityAssetSource](https://sanity-io.github.io/asset-utils//index.html#sanityassetsource) | Input source (file/image object, asset, reference, id, url, path) |

**Returns:** _string_

_Defined in [src/resolve.ts:73](https://github.com/sanity-io/asset-utils/blob/63fef3b/src/resolve.ts#L73)_

### getFile

▸ **getFile**(`src`: [SanityFileSource](https://sanity-io.github.io/asset-utils//index.html#sanityfilesource), `project`: [SanityProjectDetails](https://sanity-io.github.io/asset-utils//interfaces/sanityprojectdetails.html)): _[ResolvedSanityFile](https://sanity-io.github.io/asset-utils//interfaces/resolvedsanityfile.html)_

Tries to resolve an file object with as much information as possible,
from any inferrable structure (id, url, path, file object etc)

| Name      | Type                                                                                                  | Description                                                 |
| --------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `src`     | [SanityFileSource](https://sanity-io.github.io/asset-utils//index.html#sanityfilesource)              | Input source (file object, asset, reference, id, url, path) |
| `project` | [SanityProjectDetails](https://sanity-io.github.io/asset-utils//interfaces/sanityprojectdetails.html) | Project ID and dataset the file belongs to                  |

**Returns:** _[ResolvedSanityFile](https://sanity-io.github.io/asset-utils//interfaces/resolvedsanityfile.html)_

_Defined in [src/resolve.ts:185](https://github.com/sanity-io/asset-utils/blob/63fef3b/src/resolve.ts#L185)_

### getFileAsset

▸ **getFileAsset**(`src`: [SanityFileSource](https://sanity-io.github.io/asset-utils//index.html#sanityfilesource), `project`: [SanityProjectDetails](https://sanity-io.github.io/asset-utils//interfaces/sanityprojectdetails.html)): _[SanityFileAsset](https://sanity-io.github.io/asset-utils//index.html#sanityfileasset)_

Tries to resolve a (partial) file asset document with as much information as possible,
from any inferrable structure (id, url, path, file object etc)

| Name      | Type                                                                                                  | Description                                                 |
| --------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `src`     | [SanityFileSource](https://sanity-io.github.io/asset-utils//index.html#sanityfilesource)              | Input source (file object, asset, reference, id, url, path) |
| `project` | [SanityProjectDetails](https://sanity-io.github.io/asset-utils//interfaces/sanityprojectdetails.html) | Project ID and dataset the file belongs to                  |

**Returns:** _[SanityFileAsset](https://sanity-io.github.io/asset-utils//index.html#sanityfileasset)_

_Defined in [src/resolve.ts:210](https://github.com/sanity-io/asset-utils/blob/63fef3b/src/resolve.ts#L210)_

### getIdFromString

▸ **getIdFromString**(`str`: string): _string_

Tries to cooerce a string (ID, URL or path) to an image asset ID

| Name  | Type   | Description                    |
| ----- | ------ | ------------------------------ |
| `str` | string | Input string (ID, URL or path) |

**Returns:** _string_

_Defined in [src/resolve.ts:298](https://github.com/sanity-io/asset-utils/blob/63fef3b/src/resolve.ts#L298)_

### getImage

▸ **getImage**(`src`: [SanityImageSource](https://sanity-io.github.io/asset-utils//index.html#sanityimagesource), `project`: [SanityProjectDetails](https://sanity-io.github.io/asset-utils//interfaces/sanityprojectdetails.html)): _[ResolvedSanityImage](https://sanity-io.github.io/asset-utils//interfaces/resolvedsanityimage.html)_

Tries to resolve an image object with as much information as possible,
from any inferrable structure (id, url, path, image object etc)

| Name      | Type                                                                                                  | Description                                                  |
| --------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `src`     | [SanityImageSource](https://sanity-io.github.io/asset-utils//index.html#sanityimagesource)            | Input source (image object, asset, reference, id, url, path) |
| `project` | [SanityProjectDetails](https://sanity-io.github.io/asset-utils//interfaces/sanityprojectdetails.html) | Project ID and dataset the image belongs to                  |

**Returns:** _[ResolvedSanityImage](https://sanity-io.github.io/asset-utils//interfaces/resolvedsanityimage.html)_

_Defined in [src/resolve.ts:98](https://github.com/sanity-io/asset-utils/blob/63fef3b/src/resolve.ts#L98)_

### getImageAsset

▸ **getImageAsset**(`src`: [SanityImageSource](https://sanity-io.github.io/asset-utils//index.html#sanityimagesource), `project`: [SanityProjectDetails](https://sanity-io.github.io/asset-utils//interfaces/sanityprojectdetails.html)): _[SanityImageAsset](https://sanity-io.github.io/asset-utils//index.html#sanityimageasset)_

Tries to resolve a (partial) image asset document with as much information as possible,
from any inferrable structure (id, url, path, image object etc)

| Name      | Type                                                                                                  | Description                                                  |
| --------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `src`     | [SanityImageSource](https://sanity-io.github.io/asset-utils//index.html#sanityimagesource)            | Input source (image object, asset, reference, id, url, path) |
| `project` | [SanityProjectDetails](https://sanity-io.github.io/asset-utils//interfaces/sanityprojectdetails.html) | Project ID and dataset the image belongs to                  |

**Returns:** _[SanityImageAsset](https://sanity-io.github.io/asset-utils//index.html#sanityimageasset)_

_Defined in [src/resolve.ts:132](https://github.com/sanity-io/asset-utils/blob/63fef3b/src/resolve.ts#L132)_

### getImageDimensions

▸ **getImageDimensions**(`src`: [SanityImageSource](https://sanity-io.github.io/asset-utils//index.html#sanityimagesource)): _[SanityImageDimensions](https://sanity-io.github.io/asset-utils//index.html#sanityimagedimensions)_

Returns the width, height and aspect ratio of a passed image asset, from any
inferrable structure (id, url, path, asset document, image object etc)

| Name  | Type                                                                                       | Description                                                  |
| ----- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------ |
| `src` | [SanityImageSource](https://sanity-io.github.io/asset-utils//index.html#sanityimagesource) | Input source (image object, asset, reference, id, url, path) |

**Returns:** _[SanityImageDimensions](https://sanity-io.github.io/asset-utils//index.html#sanityimagedimensions)_

_Defined in [src/resolve.ts:49](https://github.com/sanity-io/asset-utils/blob/63fef3b/src/resolve.ts#L49)_

### getProject

▸ **getProject**(`src`: [SanityImageSource](https://sanity-io.github.io/asset-utils//index.html#sanityimagesource)): _[SanityProjectDetails](https://sanity-io.github.io/asset-utils//interfaces/sanityprojectdetails.html)_

Resolves project ID and dataset the image belongs to, based on full URL or path

| Name  | Type                                                                                       |
| ----- | ------------------------------------------------------------------------------------------ |
| `src` | [SanityImageSource](https://sanity-io.github.io/asset-utils//index.html#sanityimagesource) |

**Returns:** _[SanityProjectDetails](https://sanity-io.github.io/asset-utils//interfaces/sanityprojectdetails.html)_

_Defined in [src/resolve.ts:356](https://github.com/sanity-io/asset-utils/blob/63fef3b/src/resolve.ts#L356)_

### getUrlFilename

▸ **getUrlFilename**(`url`: string): _string_

Strips the CDN URL, path and query params from a URL, eg:
`https://cdn.sanity.io/images/project/dataset/filename-200x200.jpg?foo=bar` =>
`filename-200x200.jpg`

| Name  | Type   | Description              |
| ----- | ------ | ------------------------ |
| `url` | string | URL to get filename from |

**Returns:** _string_

_Defined in [src/paths.ts:169](https://github.com/sanity-io/asset-utils/blob/63fef3b/src/paths.ts#L169)_

### getUrlPath

▸ **getUrlPath**(`url`: string): _string_

Strips the CDN URL and query params from a URL, eg:
`https://cdn.sanity.io/images/project/dataset/filename-200x200.jpg?foo=bar` =>
`images/project/dataset/filename-200x200.jpg`

| Name  | Type   | Description               |
| ----- | ------ | ------------------------- |
| `url` | string | URL to get path name from |

**Returns:** _string_

_Defined in [src/paths.ts:137](https://github.com/sanity-io/asset-utils/blob/63fef3b/src/paths.ts#L137)_

### hasPath

▸ **hasPath**(`urlOrPath`: string): _boolean_

Checks whether or not the given URL contains an asset path

| Name        | Type   |
| ----------- | ------ |
| `urlOrPath` | string |

**Returns:** _boolean_

_Defined in [src/paths.ts:94](https://github.com/sanity-io/asset-utils/blob/63fef3b/src/paths.ts#L94)_

### idFromUrl

▸ **idFromUrl**(`url`: string): _string_

Converts from a full asset URL to just the asset document ID

| Name  | Type   | Description                 |
| ----- | ------ | --------------------------- |
| `url` | string | A full asset URL to convert |

**Returns:** _string_

_Defined in [src/resolve.ts:341](https://github.com/sanity-io/asset-utils/blob/63fef3b/src/resolve.ts#L341)_

### isAssetFilename

▸ **isAssetFilename**(`filename`: string): _boolean_

Returns whether or not the passed filename is a valid file or image asset filename

| Name       | Type   | Description          |
| ---------- | ------ | -------------------- |
| `filename` | string | Filename to validate |

**Returns:** _boolean_

_Defined in [src/resolve.ts:404](https://github.com/sanity-io/asset-utils/blob/63fef3b/src/resolve.ts#L404)_

### isAssetIdStub

▸ **isAssetIdStub**(`stub`: unknown): _stub is [SanityAssetIdStub](https://sanity-io.github.io/asset-utils//interfaces/sanityassetidstub.html)_

Checks whether or not the given source is an asset ID stub
(an object containing an `_id` property)

| Name   | Type    | Description            |
| ------ | ------- | ---------------------- |
| `stub` | unknown | Possible asset id stub |

**Returns:** _stub is [SanityAssetIdStub](https://sanity-io.github.io/asset-utils//interfaces/sanityassetidstub.html)_

_Defined in [src/types.ts:116](https://github.com/sanity-io/asset-utils/blob/63fef3b/src/types.ts#L116)_

### isAssetObjectStub

▸ **isAssetObjectStub**(`stub`: unknown): _stub is [SanityAssetObjectStub](https://sanity-io.github.io/asset-utils//index.html#sanityassetobjectstub)_

Checks whether or not the given source is an asset object stub

| Name   | Type    | Description                |
| ------ | ------- | -------------------------- |
| `stub` | unknown | Possible asset object stub |

**Returns:** _stub is [SanityAssetObjectStub](https://sanity-io.github.io/asset-utils//index.html#sanityassetobjectstub)_

_Defined in [src/types.ts:259](https://github.com/sanity-io/asset-utils/blob/63fef3b/src/types.ts#L259)_

### isAssetPathStub

▸ **isAssetPathStub**(`stub`: unknown): _stub is [SanityAssetPathStub](https://sanity-io.github.io/asset-utils//interfaces/sanityassetpathstub.html)_

Checks whether or not the given source is an asset path stub
(an object containing a `path` property)

| Name   | Type    | Description              |
| ------ | ------- | ------------------------ |
| `stub` | unknown | Possible asset path stub |

**Returns:** _stub is [SanityAssetPathStub](https://sanity-io.github.io/asset-utils//interfaces/sanityassetpathstub.html)_

_Defined in [src/types.ts:131](https://github.com/sanity-io/asset-utils/blob/63fef3b/src/types.ts#L131)_

### isAssetUrlStub

▸ **isAssetUrlStub**(`stub`: unknown): _stub is [SanityAssetUrlStub](https://sanity-io.github.io/asset-utils//interfaces/sanityasseturlstub.html)_

Checks whether or not the given source is an asset URL stub
(an object containing a `url` property)

| Name   | Type    | Description             |
| ------ | ------- | ----------------------- |
| `stub` | unknown | Possible asset url stub |

**Returns:** _stub is [SanityAssetUrlStub](https://sanity-io.github.io/asset-utils//interfaces/sanityasseturlstub.html)_

_Defined in [src/types.ts:146](https://github.com/sanity-io/asset-utils/blob/63fef3b/src/types.ts#L146)_

### isDefaultCrop

▸ **isDefaultCrop**(`crop`: [SanityImageCrop](https://sanity-io.github.io/asset-utils//interfaces/sanityimagecrop.html)): _boolean_

Returns whether or not the passed crop has the default values for a crop region

| Name   | Type                                                                                        |
| ------ | ------------------------------------------------------------------------------------------- |
| `crop` | [SanityImageCrop](https://sanity-io.github.io/asset-utils//interfaces/sanityimagecrop.html) |

**Returns:** _boolean_

_Defined in [src/hotspotCrop.ts:43](https://github.com/sanity-io/asset-utils/blob/63fef3b/src/hotspotCrop.ts#L43)_

### isDefaultHotspot

▸ **isDefaultHotspot**(`hotspot`: [SanityImageHotspot](https://sanity-io.github.io/asset-utils//interfaces/sanityimagehotspot.html)): _boolean_

Returns whether or not the passed hotspot has the default values for a hotspot region

| Name      | Type                                                                                              |
| --------- | ------------------------------------------------------------------------------------------------- |
| `hotspot` | [SanityImageHotspot](https://sanity-io.github.io/asset-utils//interfaces/sanityimagehotspot.html) |

**Returns:** _boolean_

_Defined in [src/hotspotCrop.ts:63](https://github.com/sanity-io/asset-utils/blob/63fef3b/src/hotspotCrop.ts#L63)_

### isFileAssetFilename

▸ **isFileAssetFilename**(`filename`: string): _boolean_

Returns whether or not the passed filename is a valid file asset filename

| Name       | Type   | Description          |
| ---------- | ------ | -------------------- |
| `filename` | string | Filename to validate |

**Returns:** _boolean_

_Defined in [src/resolve.ts:394](https://github.com/sanity-io/asset-utils/blob/63fef3b/src/resolve.ts#L394)_

### isFileSource

▸ **isFileSource**(`src`: [SanityAssetSource](https://sanity-io.github.io/asset-utils//index.html#sanityassetsource)): _src is [SanityFileSource](https://sanity-io.github.io/asset-utils//index.html#sanityfilesource)_

Return whether or not the passed source is a file source

| Name  | Type                                                                                       | Description     |
| ----- | ------------------------------------------------------------------------------------------ | --------------- |
| `src` | [SanityAssetSource](https://sanity-io.github.io/asset-utils//index.html#sanityassetsource) | Source to check |

**Returns:** _src is [SanityFileSource](https://sanity-io.github.io/asset-utils//index.html#sanityfilesource)_

_Defined in [src/resolve.ts:414](https://github.com/sanity-io/asset-utils/blob/63fef3b/src/resolve.ts#L414)_

### isImageAssetFilename

▸ **isImageAssetFilename**(`filename`: string): _boolean_

Returns whether or not the passed filename is a valid image asset filename

| Name       | Type   | Description          |
| ---------- | ------ | -------------------- |
| `filename` | string | Filename to validate |

**Returns:** _boolean_

_Defined in [src/resolve.ts:384](https://github.com/sanity-io/asset-utils/blob/63fef3b/src/resolve.ts#L384)_

### isImageSource

▸ **isImageSource**(`src`: [SanityAssetSource](https://sanity-io.github.io/asset-utils//index.html#sanityassetsource)): _src is [SanityImageSource](https://sanity-io.github.io/asset-utils//index.html#sanityimagesource)_

Return whether or not the passed source is an image source

| Name  | Type                                                                                       | Description     |
| ----- | ------------------------------------------------------------------------------------------ | --------------- |
| `src` | [SanityAssetSource](https://sanity-io.github.io/asset-utils//index.html#sanityassetsource) | Source to check |

**Returns:** _src is [SanityImageSource](https://sanity-io.github.io/asset-utils//index.html#sanityimagesource)_

_Defined in [src/resolve.ts:425](https://github.com/sanity-io/asset-utils/blob/63fef3b/src/resolve.ts#L425)_

### isReference

▸ **isReference**(`ref`: unknown): _ref is [SanityReference](https://sanity-io.github.io/asset-utils//interfaces/sanityreference.html)_

Checks whether or not the given source is a Sanity reference
(an object containing \_ref string key)

| Name  | Type    | Description        |
| ----- | ------- | ------------------ |
| `ref` | unknown | Possible reference |

**Returns:** _ref is [SanityReference](https://sanity-io.github.io/asset-utils//interfaces/sanityreference.html)_

_Defined in [src/types.ts:101](https://github.com/sanity-io/asset-utils/blob/63fef3b/src/types.ts#L101)_

### isSanityFileAsset

▸ **isSanityFileAsset**(`src`: unknown): _src is [SanityFileAsset](https://sanity-io.github.io/asset-utils//index.html#sanityfileasset)_

Checks whether or not the given source is a (partial) sanity file asset document.
Only checks the `_type` property, all other properties _may_ be missing

| Name  | Type    | Description     |
| ----- | ------- | --------------- |
| `src` | unknown | Source to check |

**Returns:** _src is [SanityFileAsset](https://sanity-io.github.io/asset-utils//index.html#sanityfileasset)_

_Defined in [src/types.ts:177](https://github.com/sanity-io/asset-utils/blob/63fef3b/src/types.ts#L177)_

### isUnresolvableError

▸ **isUnresolvableError**(`err`: Error): _err is [UnresolvableError](https://sanity-io.github.io/asset-utils//index.html#unresolvableerror)_

Checks whether or not an error instance is of type UnresolvableError

| Name  | Type  | Description                                |
| ----- | ----- | ------------------------------------------ |
| `err` | Error | Error to check for unresolvable error type |

**Returns:** _err is [UnresolvableError](https://sanity-io.github.io/asset-utils//index.html#unresolvableerror)_

_Defined in [src/utils.ts:36](https://github.com/sanity-io/asset-utils/blob/63fef3b/src/utils.ts#L36)_

### isValidFilename

▸ **isValidFilename**(`filename`: string): _boolean_

Checks whether or not a given filename matches the expected Sanity asset filename pattern

| Name       | Type   | Description                    |
| ---------- | ------ | ------------------------------ |
| `filename` | string | Filename to check for validity |

**Returns:** _boolean_

_Defined in [src/paths.ts:193](https://github.com/sanity-io/asset-utils/blob/63fef3b/src/paths.ts#L193)_

### parseAssetFilename

▸ **parseAssetFilename**(`filename`: string): _[SanityAssetIdParts](https://sanity-io.github.io/asset-utils//index.html#sanityassetidparts)_

Parses a Sanity asset filename into individual parts (type, id, extension, width, height)

| Name       | Type   | Description                        |
| ---------- | ------ | ---------------------------------- |
| `filename` | string | Filename to parse into named parts |

**Returns:** _[SanityAssetIdParts](https://sanity-io.github.io/asset-utils//index.html#sanityassetidparts)_

_Defined in [src/parse.ts:77](https://github.com/sanity-io/asset-utils/blob/63fef3b/src/parse.ts#L77)_

### parseAssetId

▸ **parseAssetId**(`documentId`: string): _[SanityAssetIdParts](https://sanity-io.github.io/asset-utils//index.html#sanityassetidparts)_

Parses a Sanity asset document ID into individual parts (type, id, extension, width/height etc)

| Name         | Type   | Description                           |
| ------------ | ------ | ------------------------------------- |
| `documentId` | string | Document ID to parse into named parts |

**Returns:** _[SanityAssetIdParts](https://sanity-io.github.io/asset-utils//index.html#sanityassetidparts)_

_Defined in [src/parse.ts:22](https://github.com/sanity-io/asset-utils/blob/63fef3b/src/parse.ts#L22)_

### parseFileAssetId

▸ **parseFileAssetId**(`documentId`: string): _[SanityFileAssetIdParts](https://sanity-io.github.io/asset-utils//interfaces/sanityfileassetidparts.html)_

Parses a Sanity file asset document ID into individual parts (type, id, extension)

| Name         | Type   | Description                                      |
| ------------ | ------ | ------------------------------------------------ |
| `documentId` | string | File asset document ID to parse into named parts |

**Returns:** _[SanityFileAssetIdParts](https://sanity-io.github.io/asset-utils//interfaces/sanityfileassetidparts.html)_

_Defined in [src/parse.ts:41](https://github.com/sanity-io/asset-utils/blob/63fef3b/src/parse.ts#L41)_

### parseImageAssetId

▸ **parseImageAssetId**(`documentId`: string): _[SanityImageAssetIdParts](https://sanity-io.github.io/asset-utils//index.html#sanityimageassetidparts)_

Parses a Sanity image asset document ID into individual parts (type, id, extension, width, height)

| Name         | Type   | Description                                       |
| ------------ | ------ | ------------------------------------------------- |
| `documentId` | string | Image asset document ID to parse into named parts |

**Returns:** _[SanityImageAssetIdParts](https://sanity-io.github.io/asset-utils//index.html#sanityimageassetidparts)_

_Defined in [src/parse.ts:59](https://github.com/sanity-io/asset-utils/blob/63fef3b/src/parse.ts#L59)_

### tryGetAssetDocumentId

▸ **tryGetAssetDocumentId**(`src`: [SanityAssetSource](https://sanity-io.github.io/asset-utils//index.html#sanityassetsource)): _string_

Tries to resolve the asset document ID from any inferrable structure

| Name  | Type                                                                                       | Description                                                       |
| ----- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| `src` | [SanityAssetSource](https://sanity-io.github.io/asset-utils//index.html#sanityassetsource) | Input source (image/file object, asset, reference, id, url, path) |

**Returns:** _string_

_Defined in [src/resolve.ts:286](https://github.com/sanity-io/asset-utils/blob/63fef3b/src/resolve.ts#L286)_

### tryGetAssetPath

▸ **tryGetAssetPath**(`src`: [SanityAssetSource](https://sanity-io.github.io/asset-utils//index.html#sanityassetsource)): _string | undefined_

Tries to get the asset path from a given asset source

| Name  | Type                                                                                       | Description                                  |
| ----- | ------------------------------------------------------------------------------------------ | -------------------------------------------- |
| `src` | [SanityAssetSource](https://sanity-io.github.io/asset-utils//index.html#sanityassetsource) | The source image to infer an asset path from |

**Returns:** _string | undefined_

_Defined in [src/paths.ts:104](https://github.com/sanity-io/asset-utils/blob/63fef3b/src/paths.ts#L104)_

### tryGetExtension

▸ **tryGetExtension**(`src`: [SanityAssetSource](https://sanity-io.github.io/asset-utils//index.html#sanityassetsource)): _string_

Returns the file extension for a given asset

| Name  | Type                                                                                       | Description                                                       |
| ----- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| `src` | [SanityAssetSource](https://sanity-io.github.io/asset-utils//index.html#sanityassetsource) | Input source (file/image object, asset, reference, id, url, path) |

**Returns:** _string_

_Defined in [src/resolve.ts:85](https://github.com/sanity-io/asset-utils/blob/63fef3b/src/resolve.ts#L85)_

### tryGetFile

▸ **tryGetFile**(`src`: [SanityFileSource](https://sanity-io.github.io/asset-utils//index.html#sanityfilesource), `project`: [SanityProjectDetails](https://sanity-io.github.io/asset-utils//interfaces/sanityprojectdetails.html)): _[ResolvedSanityFile](https://sanity-io.github.io/asset-utils//interfaces/resolvedsanityfile.html)_

Tries to resolve an file object with as much information as possible,
from any inferrable structure (id, url, path, file object etc)

| Name      | Type                                                                                                  | Description                                                 |
| --------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `src`     | [SanityFileSource](https://sanity-io.github.io/asset-utils//index.html#sanityfilesource)              | Input source (file object, asset, reference, id, url, path) |
| `project` | [SanityProjectDetails](https://sanity-io.github.io/asset-utils//interfaces/sanityprojectdetails.html) | Project ID and dataset the file belongs to                  |

**Returns:** _[ResolvedSanityFile](https://sanity-io.github.io/asset-utils//interfaces/resolvedsanityfile.html)_

_Defined in [src/resolve.ts:197](https://github.com/sanity-io/asset-utils/blob/63fef3b/src/resolve.ts#L197)_

### tryGetFileAsset

▸ **tryGetFileAsset**(`src`: [SanityFileSource](https://sanity-io.github.io/asset-utils//index.html#sanityfilesource), `project`: [SanityProjectDetails](https://sanity-io.github.io/asset-utils//interfaces/sanityprojectdetails.html)): _[SanityFileAsset](https://sanity-io.github.io/asset-utils//index.html#sanityfileasset)_

Tries to resolve a (partial) file asset document with as much information as possible,
from any inferrable structure (id, url, path, file object etc)

| Name      | Type                                                                                                  | Description                                                 |
| --------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `src`     | [SanityFileSource](https://sanity-io.github.io/asset-utils//index.html#sanityfilesource)              | Input source (file object, asset, reference, id, url, path) |
| `project` | [SanityProjectDetails](https://sanity-io.github.io/asset-utils//interfaces/sanityprojectdetails.html) | Project ID and dataset the file belongs to                  |

**Returns:** _[SanityFileAsset](https://sanity-io.github.io/asset-utils//index.html#sanityfileasset)_

_Defined in [src/resolve.ts:245](https://github.com/sanity-io/asset-utils/blob/63fef3b/src/resolve.ts#L245)_

### tryGetIdFromString

▸ **tryGetIdFromString**(`str`: string): _string_

Tries to cooerce a string (ID, URL or path) to an image asset ID

| Name  | Type   | Description                    |
| ----- | ------ | ------------------------------ |
| `str` | string | Input string (ID, URL or path) |

**Returns:** _string_

_Defined in [src/resolve.ts:333](https://github.com/sanity-io/asset-utils/blob/63fef3b/src/resolve.ts#L333)_

### tryGetImage

▸ **tryGetImage**(`src`: [SanityImageSource](https://sanity-io.github.io/asset-utils//index.html#sanityimagesource), `project`: [SanityProjectDetails](https://sanity-io.github.io/asset-utils//interfaces/sanityprojectdetails.html)): _[ResolvedSanityImage](https://sanity-io.github.io/asset-utils//interfaces/resolvedsanityimage.html)_

Tries to resolve an image object with as much information as possible,
from any inferrable structure (id, url, path, image object etc)

| Name      | Type                                                                                                  | Description                                                  |
| --------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `src`     | [SanityImageSource](https://sanity-io.github.io/asset-utils//index.html#sanityimagesource)            | Input source (image object, asset, reference, id, url, path) |
| `project` | [SanityProjectDetails](https://sanity-io.github.io/asset-utils//interfaces/sanityprojectdetails.html) | Project ID and dataset the image belongs to                  |

**Returns:** _[ResolvedSanityImage](https://sanity-io.github.io/asset-utils//interfaces/resolvedsanityimage.html)_

_Defined in [src/resolve.ts:119](https://github.com/sanity-io/asset-utils/blob/63fef3b/src/resolve.ts#L119)_

### tryGetImageAsset

▸ **tryGetImageAsset**(`src`: [SanityImageSource](https://sanity-io.github.io/asset-utils//index.html#sanityimagesource), `project`: [SanityProjectDetails](https://sanity-io.github.io/asset-utils//interfaces/sanityprojectdetails.html)): _[SanityImageAsset](https://sanity-io.github.io/asset-utils//index.html#sanityimageasset)_

Tries to resolve a (partial) image asset document with as much information as possible,
from any inferrable structure (id, url, path, image object etc)

| Name      | Type                                                                                                  | Description                                                  |
| --------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `src`     | [SanityImageSource](https://sanity-io.github.io/asset-utils//index.html#sanityimagesource)            | Input source (image object, asset, reference, id, url, path) |
| `project` | [SanityProjectDetails](https://sanity-io.github.io/asset-utils//interfaces/sanityprojectdetails.html) | Project ID and dataset the image belongs to                  |

**Returns:** _[SanityImageAsset](https://sanity-io.github.io/asset-utils//index.html#sanityimageasset)_

_Defined in [src/resolve.ts:172](https://github.com/sanity-io/asset-utils/blob/63fef3b/src/resolve.ts#L172)_

### tryGetImageDimensions

▸ **tryGetImageDimensions**(`src`: [SanityImageSource](https://sanity-io.github.io/asset-utils//index.html#sanityimagesource)): _[SanityImageDimensions](https://sanity-io.github.io/asset-utils//index.html#sanityimagedimensions)_

Returns the width, height and aspect ratio of a passed image asset, from any
inferrable structure (id, url, path, asset document, image object etc)

| Name  | Type                                                                                       | Description                                                  |
| ----- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------ |
| `src` | [SanityImageSource](https://sanity-io.github.io/asset-utils//index.html#sanityimagesource) | Input source (image object, asset, reference, id, url, path) |

**Returns:** _[SanityImageDimensions](https://sanity-io.github.io/asset-utils//index.html#sanityimagedimensions)_

_Defined in [src/resolve.ts:62](https://github.com/sanity-io/asset-utils/blob/63fef3b/src/resolve.ts#L62)_

### tryGetProject

▸ **tryGetProject**(`src`: [SanityImageSource](https://sanity-io.github.io/asset-utils//index.html#sanityimagesource)): _[SanityProjectDetails](https://sanity-io.github.io/asset-utils//interfaces/sanityprojectdetails.html)_

Resolves project ID and dataset the image belongs to, based on full URL or path

| Name  | Type                                                                                       |
| ----- | ------------------------------------------------------------------------------------------ |
| `src` | [SanityImageSource](https://sanity-io.github.io/asset-utils//index.html#sanityimagesource) |

**Returns:** _[SanityProjectDetails](https://sanity-io.github.io/asset-utils//interfaces/sanityprojectdetails.html)_

_Defined in [src/resolve.ts:376](https://github.com/sanity-io/asset-utils/blob/63fef3b/src/resolve.ts#L376)_

### tryGetUrlFilename

▸ **tryGetUrlFilename**(`url`: string): _string_

Strips the CDN URL, path and query params from a URL, eg:
`https://cdn.sanity.io/images/project/dataset/filename-200x200.jpg?foo=bar` =>
`filename-200x200.jpg`

| Name  | Type   | Description              |
| ----- | ------ | ------------------------ |
| `url` | string | URL to get filename from |

**Returns:** _string_

_Defined in [src/paths.ts:185](https://github.com/sanity-io/asset-utils/blob/63fef3b/src/paths.ts#L185)_

### tryGetUrlPath

▸ **tryGetUrlPath**(`url`: string): _string_

Strips the CDN URL and query params from a URL, eg:
`https://cdn.sanity.io/images/project/dataset/filename-200x200.jpg?foo=bar` =>
`images/project/dataset/filename-200x200.jpg`

| Name  | Type   | Description               |
| ----- | ------ | ------------------------- |
| `url` | string | URL to get path name from |

**Returns:** _string_

_Defined in [src/paths.ts:158](https://github.com/sanity-io/asset-utils/blob/63fef3b/src/paths.ts#L158)_

## License

MIT-licensed. See LICENSE.
