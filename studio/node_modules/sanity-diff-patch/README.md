# sanity-diff-patch

[![npm version](http://img.shields.io/npm/v/sanity-diff-patch.svg?style=flat-square)](https://www.npmjs.com/package/sanity-diff-patch)[![npm bundle size](https://img.shields.io/bundlephobia/minzip/sanity-diff-patch.svg?style=flat-square)](https://bundlephobia.com/result?p=sanity-diff-patch)[![Build Status](http://img.shields.io/travis/rexxars/sanity-diff-patch/main.svg?style=flat-square)](https://travis-ci.com/rexxars/sanity-diff-patch)

Generates a set of [Sanity](https://www.sanity.io/) patches needed to change an item (usually a document) from one shape to another.

Most values will become simple `set`, `unset` or `insert` operations, but it will also (by default) try to use [diff-match-patch](https://www.sanity.io/docs/http-patches#diffmatchpatch-aTbJhlAJ) for strings ([read more](#diff-match-patch)).

An `ifRevisionID` constraint can be given to generate patches that include this revision as a safeguard, to prevent modifying documents that has changed since the diff was generated.

The document ID used in the patches is either extracted from item A and item B (`_id` property), or can be set explicitly by using the `id` option. This is _required_ if the `_id` property differs in the two items, to prevent patching the wrong document.

If encountering `undefined` values within an array, they will be converted to `null` values and print a warning to the console. Should you want to remove undefined values from arrays, manually remove them from the array prior to diffing (`array.filter(item => typeof item === 'undefined')` is your friend).

## Getting started

npm install --save sanity-diff-patch

## Usage

```js
import {diffPatch} from 'sanity-diff-patch'

const patch = diffPatch(itemA, itemB)
/*
[
  {patch: {id: 'docId', set: {...}}},
  {patch: {id: 'docId', unset: [...]}},
  {patch: {id: 'docId', insert: {...}}}
]
*/
```

## Usage with mutations

```js
import {diffPatch} from 'sanity-diff-patch'
import sanityClient from './myConfiguredSanityClient'

const itemA = {
  _id: 'die-hard-iii',
  _type: 'movie',
  _rev: 'k0k0s',
  name: 'Die Hard 3',
  year: 1995,
  characters: [
    {
      _key: 'ma4sg31',
      name: 'John McClane'
    },
    {
      _key: 'l13ma92',
      name: 'Simon Gruber'
    }
  ]
}

const itemB = {
  _id: 'drafts.die-hard-iii',
  _type: 'movie',
  name: 'Die Hard with a Vengeance',
  characters: [
    {
      _key: 'ma4sg31',
      name: 'John McClane'
    },
    {
      _key: 'l13ma92',
      name: 'Simon Grüber'
    }
  ]
}

// Specify id if the two documents do not match
const operations = diffPatch(itemA, itemB, {id: itemA._id, ifRevisionID: itemA._rev})
await sanityClient.transaction(operations).commit()

// Patches generated:
const generatedPatches = [
  {
    patch: {
      id: 'die-hard-iii',
      ifRevisionID: 'k0k0s',
      set: {
        'name': 'Die Hard with a Vengeance',
        'characters[_key=="l13ma92"].name': 'Simon Grüber'
      },
    }
  },
  {
    patch: {
      id: 'die-hard-iii',
      unset: ['year']
    }
  }
}
```

## diff-match-patch

When encountering two strings to compare, this module will (by default) attempt to use [diff-match-patch (DMP)](https://www.sanity.io/docs/http-patches#diffmatchpatch-aTbJhlAJ) to transition the string from one state to the next.

While these patches are extremely helpful (especially in a real-time, collaborative environment), they sometimes grow quite large and can be hard for humans to read. There are a few options you can use to tweak _when_ this module will use these patches, and when to fall back to a regular `set`-patch instead.

The default rules says:

- If the target string is below 30 characters long, don't use DMP
- If the generated DMP is greater than 1.2 times larger than the target string, don't use DMP

To tune these rules, you can pass options to the differ:

```js
import {diffPatch} from 'sanity-diff-patch'

diffPatch(itemA, itemB, {
  diffMatchPatch: {
    // Default is true, set to false to _always_ use `set`-patches
    enabled: true,

    // Only use diff-match-patch if target string is longer than this threshold
    lengthThresholdAbsolute: 30,

    // Only use generated diff-match-patch if the patch length is less than or equal to
    // (targetString * relative). Example: A 100 character target with a relative factor
    // of 1.2 will allow a 120 character diff-match-patch. If larger than this number,
    // it will fall back to a regular `set` patch.
    lengthThresholdRelative: 1.2
  }
})
```

In addition to these rules, there are certain cases where it will never use diff-match-patch:

- If the patched key starts with an underscore (eg `_type`, `_key`, `_ref`)
- If the diff-match-patch implementation cannot generate a legal patch due to unicode issues

## Needs improvement

- Improve patch on array item move
- Improve patch on array item delete

## License

MIT-licensed. See LICENSE.
