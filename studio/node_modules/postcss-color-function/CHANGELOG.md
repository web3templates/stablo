# 4.1.0 - 2019-04-01

- Added: `preserveCustomProps` option to preserve custom properties
- Updated: `postcss` to 6.0.23 (patch)
- Updated: `postcss-value-parser` to 3.3.1 (patch)

# 4.0.1 - 2017-11-03

- Fixed: bug when using the `tint`, `shade`, and `contrast` adjusters along with the `alpha` adjuster
([#33](https://github.com/postcss/postcss-color-function/pull/33) - @tylergaw)

# 4.0.0 - 2017-05-15

- Added: compatibility with postcss v6.x
- Updated dependencies

# 3.0.0 - 2017-02-01

- Changed: send postcss warning when color function cannot be parsed instead of throwing
([#35](https://github.com/postcss/postcss-color-function/pull/35) - @drewbourne)
- Changed: send a postcss message when color function contains a var()
([#36](https://github.com/postcss/postcss-color-function/pull/36) - @drewbourne)

# 2.0.1 - 2016-03-15

- Fixed: whitespace are retained between color() usage.
  ([#27](https://github.com/postcss/postcss-color-function/pull/27))

# 2.0.0 - 2015-09-07

- Removed: compatibility with postcss v4.x
([#14](https://github.com/postcss/postcss-color-function/pull/14))
- Added: compatibility with postcss v5.x
([#14](https://github.com/postcss/postcss-color-function/pull/14))

# 1.3.2 - 2015-07-08

- Fixed: the plugin now do now transform all functions that match `*color(` but
only the one that are real color function call
([#12](https://github.com/postcss/postcss-color-function/pull/12))

# 1.3.1 - 2015-07-08 **YANKED**

_This was just 1.3.0._

# 1.3.0 - 2015-06-13

- Changed: upgrade to PostCSS 4.1.x

# 1.2.0 - 2015-03-12

- Added: contrast() adjuster

# 1.1.0 - 2014-11-25

- Added: Enhanced exceptions

# 1.0.0 - 2014-10-04

✨ Initial release from [postcss-color](https://github.com/postcss/postcss-color)
