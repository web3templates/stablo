import {SanityImageCrop, SanityImageHotspot} from './types'

/**
 * Default crop (equals to "whole image")
 */
export const DEFAULT_CROP: Readonly<SanityImageCrop> = Object.freeze({
  left: 0,
  top: 0,
  bottom: 0,
  right: 0,
})

/**
 * Default hotspot (equals to horizontal/vertical center, full size of image)
 */
export const DEFAULT_HOTSPOT: Readonly<SanityImageHotspot> = Object.freeze({
  x: 0.5,
  y: 0.5,
  height: 1,
  width: 1,
})

/**
 * Returns cloned version of the default crop (prevents accidental mutations)
 *
 * @returns Default image crop object
 */
export const getDefaultCrop = (): SanityImageCrop => ({...DEFAULT_CROP})

/**
 * Returns cloned version of the default hotspot (prevents accidental mutations)
 *
 * @returns Default image hotspot object
 */
export const getDefaultHotspot = (): SanityImageHotspot => ({...DEFAULT_HOTSPOT})

/**
 * Returns whether or not the passed crop has the default values for a crop region
 *
 * @param crop The crop to return whether or not is the default crop
 * @returns True if passed crop matches default, false otherwise
 */
export const isDefaultCrop = (crop: SanityImageCrop): boolean => {
  const {top, bottom, left, right} = crop
  const {
    top: defaultTop,
    bottom: defaultBottom,
    left: defaultLeft,
    right: defaultRight,
  } = DEFAULT_CROP

  return (
    top === defaultTop && bottom === defaultBottom && left === defaultLeft && right === defaultRight
  )
}

/**
 * Returns whether or not the passed hotspot has the default values for a hotspot region
 *
 * @param hotspot The hotspot to return whether or not is the default hotspot
 * @returns True if passed hotspot matches default, false otherwise
 */
export const isDefaultHotspot = (hotspot: SanityImageHotspot): boolean => {
  const {x, y, width, height} = hotspot
  const {x: defaultX, y: defaultY, width: defaultWidth, height: defaultHeight} = DEFAULT_HOTSPOT

  return x === defaultX && y === defaultY && width === defaultWidth && height === defaultHeight
}
