export declare type ImageUrlBuilderOptions = Partial<SanityProjectDetails> & {
    baseUrl?: string;
    source?: SanityImageSource;
    bg?: string;
    dpr?: number;
    width?: number;
    height?: number;
    focalPoint?: {
        x: number;
        y: number;
    };
    maxWidth?: number;
    maxHeight?: number;
    minWidth?: number;
    minHeight?: number;
    blur?: number;
    sharpen?: number;
    rect?: {
        left: number;
        top: number;
        width: number;
        height: number;
    };
    format?: ImageFormat;
    invert?: boolean;
    orientation?: Orientation;
    quality?: number;
    download?: boolean | string;
    flipHorizontal?: boolean;
    flipVertical?: boolean;
    ignoreImageParams?: boolean;
    fit?: FitMode;
    crop?: CropMode;
    saturation?: number;
    auto?: AutoMode;
    pad?: number;
};
export declare type ImageUrlBuilderOptionsWithAliases = ImageUrlBuilderOptions & {
    w?: number;
    h?: number;
    q?: number;
    fm?: number;
    dl?: boolean | string;
    or?: Orientation;
    sharp?: number;
    'min-h'?: number;
    'max-h'?: number;
    'min-w'?: number;
    'max-w'?: number;
    sat?: number;
    [key: string]: any;
};
export declare type ImageUrlBuilderOptionsWithAsset = ImageUrlBuilderOptions & {
    asset: {
        id: string;
        width: number;
        height: number;
        format: string;
    };
    [key: string]: any;
};
export declare type ImageFormat = 'jpg' | 'pjpg' | 'png' | 'webp';
export declare type FitMode = 'clip' | 'crop' | 'fill' | 'fillmax' | 'max' | 'scale' | 'min';
export declare type CropMode = 'top' | 'bottom' | 'left' | 'right' | 'center' | 'focalpoint' | 'entropy';
export declare type AutoMode = 'format';
export declare type Orientation = 0 | 90 | 180 | 270;
export interface SanityClientLike {
    clientConfig: {
        dataset?: string;
        projectId?: string;
        apiHost?: string;
    };
}
export declare type SanityImageSource = string | SanityReference | SanityAsset | SanityImageObject | SanityImageWithAssetStub;
export interface SanityProjectDetails {
    projectId: string;
    dataset: string;
}
export interface SanityReference {
    _ref: string;
}
export interface SanityImageWithAssetStub {
    asset: {
        url: string;
    };
}
export interface SanityAsset {
    _id?: string;
    url?: string;
    path?: string;
    assetId?: string;
    extension?: string;
    [key: string]: any;
}
export interface SanityImageDimensions {
    aspectRatio: number;
    height: number;
    width: number;
}
export interface SanityImageFitResult {
    width?: number;
    height?: number;
    rect: SanityImageRect;
}
export interface SanityImageRect {
    left: number;
    top: number;
    width: number;
    height: number;
}
export interface SanityImageCrop {
    _type?: string;
    left: number;
    bottom: number;
    right: number;
    top: number;
}
export interface SanityImageHotspot {
    _type?: string;
    width: number;
    height: number;
    x: number;
    y: number;
}
export interface SanityImageObject {
    asset: SanityReference | SanityAsset;
    crop?: SanityImageCrop;
    hotspot?: SanityImageHotspot;
}
export interface CropSpec {
    left: number;
    top: number;
    width: number;
    height: number;
}
export interface HotspotSpec {
    left: number;
    top: number;
    right: number;
    bottom: number;
}
