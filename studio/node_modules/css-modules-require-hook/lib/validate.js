'use strict';

const {
  difference,
  forEach,
  isArray,
  isBoolean,
  isFunction,
  isPlainObject,
  isRegExp,
  isString,
  keys,
} = require('lodash');

const rules = {
  // hook
  camelCase:          'boolean|string',
  devMode:            'boolean',
  extensions:         'array|string',
  ignore:             'function|regex|string',
  preprocessCss:      'function',
  processCss:         'function',
  processorOpts:      'object',
  // plugins
  append:             'array',
  prepend:            'array',
  use:                'array',
  createImportedName: 'function',
  generateScopedName: 'function|string',
  hashPrefix:         'string',
  mode:               'string',
  rootDir:            'string',
};

const tests = {
  array:    isArray,
  boolean:  isBoolean,
  function: isFunction,
  object:   isPlainObject,
  regex:    isRegExp,
  string:   isString,
};

module.exports = function validate(options) {
  const unknownOptions = difference(keys(options), keys(rules));
  if (unknownOptions.length) {
    throw new Error(`unknown arguments: ${unknownOptions.join(', ')}.`);
  }

  forEach(rules, (types, rule) => {
    if (typeof options[rule] === 'undefined') {
      return;
    }

    if (!types.split('|').some(type => tests[type](options[rule]))) {
      throw new TypeError(`should specify ${types} as ${rule}`);
    }
  });
}
