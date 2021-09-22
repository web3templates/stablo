const SIZES = {
  xsmall: {min: 0, max: 599},
  small: {min: 600, max: 779},
  medium: {min: 780, max: 979},
  large: {min: 980, max: 1279},
  xlarge: {min: 1280, max: 1339},
  xxlarge: {min: 1340, max: Infinity}
}

export type Size = keyof typeof SIZES

export const media = {
  between(smallKey: Size, largeKey: Size, excludeLarge = false) {
    if (excludeLarge) {
      return `@media (min-width: ${
        SIZES[smallKey].min
      }px) and (max-width: ${SIZES[largeKey].min - 1}px)`
    } else {
      if (SIZES[largeKey].max === Infinity) {
        return `@media (min-width: ${SIZES[smallKey].min}px)`
      } else {
        return `@media (min-width: ${SIZES[smallKey].min}px) and (max-width: ${SIZES[largeKey].max}px)`
      }
    }
  },

  greaterThan(key: Size) {
    return `@media (min-width: ${SIZES[key].min}px)`
  },

  lessThan(key: Size) {
    return `@media (max-width: ${SIZES[key].min - 1}px)`
  },

  size(key: Size) {
    const size = SIZES[key]

    if (size.min == null) {
      return media.lessThan(key)
    } else if (size.max == null) {
      return media.greaterThan(key)
    } else {
      return media.between(key, key)
    }
  }
}

const PRIMARY = '#d9376e'
const LIGHT = '#eff0f3'
export const COLORS = {
  header: {
    background: PRIMARY,
    text: LIGHT
  },
  background: LIGHT,
  text: '#2a2a2a',
  link: PRIMARY,
  secondary: '#ff8e3c',
  tertiary: '#ff8e3c',
  shadow: '#444'
}
