4.0.0 / 2018-04-30
------------------

### Removed
- **BREAKING** Removed `noRecurseOnFailedFilter` option because it was counter-intuitive and confusing.

### Added
- `fs` option. It is useful when mocking `fs` object.
- `depthLimit` option. It can be used to specify the number of times to recurse before stoppig.

3.0.2 / 2017-10-21
------------------

- Use `var` instead of `let` in for loop.

3.0.0 / 2017-08-06
------------------

### Changed
- `graceful-fs` is now a regular dependency, and is always loaded. This should speed up `require` time.

2.1.0 / 2017-04-25
------------------

### Fixed
- Apply `opts.nodir` and `opts.nofile` when `filter` option is used.

2.0.0 / 2017-04-23
------------------

### Removed
- **BREAKING:** Removed support for `ignore` option. Instead, `filter` option can be used. See: [#1]

### Added
- `filter` option. A function that gets one argument `fn({path: '', stats: {}})` and returns true to include or false to exclude the item.
- `noRecurseOnFailedFilter` option to prevent unnecessary traversal of unwanted directories when `filter` function is used.

1.1.2 / 2017-02-17
------------------

- Changed to traditional for loop instead of using Array.forEach() because of better performance.

1.1.1 / 2017-02-05
------------------

- changed handling error to throw the exception

1.1.0 / 2017-01-25
------------------

- switched from [multimatch](https://github.com/sindresorhus/multimatch) to [micromatch](https://github.com/jonschlinkert/micromatch) for matching ignore patterns (showed faster performance)
- bug fixed: normalize root directory to make sure always return absolute paths.

1.0.2 / 2017-01-17
------------------

- initial release

[#1]: https://github.com/manidlou/node-klaw-sync/issues/1 "loading all files with certain name"

