# postcss-apply change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).


## [0.8.0] - 2017-05-28
### Added
  * Support for ancestor rules for `@apply` declarations.
    Allows for deep nested declarations like atRules.

## [0.7.0] - 2017-05-08
### Changed
  * PostCSS 6 upgrade.

### Fixed
  * Polyfill `Object.entries` for node versions lower than 7.

## [0.6.1] - 2017-03-10
### Fixed
  * A forgotten `console.log` in sources.

## [0.6.0] - 2017-03-08
### Added
  * A new `sets` option.
    Allows for in JS declared property sets.

## [0.5.0] - 2017-02-05
### Added
  * A new `preserve` option.
    Allows for keeping resolved declarations and `@apply` rules alongside.

## [0.4.0] - 2016-09-13
### Changed
  * Correctly handles property set overrides.
    [#10](https://github.com/pascalduez/postcss-apply/issues/10)

## [0.3.0] - 2016-06-23
### Changed
  * Several dependencies updates.
  * Renames in folder structure, files and main class.
  * Switch to `ava` for unit testing.
  * Switch to `nyc` for code coverage.
  * Clarify The Readme.
### Added
  * Integration unit tests.

## [0.2.0] - 2016-03-13
### Added
  * Support for parenthesis in mixin calls.
    Allows integration with Polymer.

## [0.1.0] - 2015-08-26
  * Initial release.

[Unreleased]: https://github.com/pascalduez/postcss-apply/compare/0.8.0...HEAD
[0.8.0]: https://github.com/pascalduez/postcss-apply/compare/0.7.0...0.8.0
[0.7.0]: https://github.com/pascalduez/postcss-apply/compare/0.6.1...0.7.0
[0.6.1]: https://github.com/pascalduez/postcss-apply/compare/0.6.0...0.6.1
[0.6.0]: https://github.com/pascalduez/postcss-apply/compare/0.5.0...0.6.0
[0.5.0]: https://github.com/pascalduez/postcss-apply/compare/0.4.0...0.5.0
[0.4.0]: https://github.com/pascalduez/postcss-apply/compare/0.3.0...0.4.0
[0.3.0]: https://github.com/pascalduez/postcss-apply/compare/0.2.0...0.3.0
[0.2.0]: https://github.com/pascalduez/postcss-apply/compare/0.1.0...0.2.0
[0.1.0]: https://github.com/pascalduez/postcss-apply/tags/0.1.0
