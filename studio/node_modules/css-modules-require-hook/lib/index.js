'use strict';

const {assign, identity, negate, camelCase: camelCaseFunc, mapKeys} = require('lodash');
const {dirname, relative, resolve} = require('path');
const {readFileSync} = require('fs');
const {transformTokens} = require('./transformTokens');

const attachHook = require('./attachHook');
const genericNames = require('generic-names');
const globToRegex = require('glob-to-regexp');
const validate = require('./validate');

const postcss = require('postcss');
const Values = require('postcss-modules-values');
const LocalByDefault = require('postcss-modules-local-by-default');
const ExtractImports = require('postcss-modules-extract-imports');
const Scope = require('postcss-modules-scope');
const Parser = require('postcss-modules-parser');

const debugFetch = require('debug')('css-modules:fetch');
const debugSetup = require('debug')('css-modules:setup');

module.exports = function setupHook({
  camelCase,
  devMode,
  extensions = '.css',
  ignore,
  preprocessCss = identity,
  processCss,
  processorOpts,
  append = [],
  prepend = [],
  createImportedName,
  generateScopedName,
  hashPrefix,
  mode,
  use,
  rootDir: context = process.cwd(),
}) {
  debugSetup(arguments[0]);
  validate(arguments[0]);

  const tokensByFile = {};

  // debug option is preferred NODE_ENV === 'development'
  const debugMode = typeof devMode !== 'undefined'
    ? devMode
    : process.env.NODE_ENV === 'development';

  let scopedName;
  if (generateScopedName) {
    scopedName = typeof generateScopedName !== 'function'
      ? genericNames(generateScopedName, {context, hashPrefix}) //  for example '[name]__[local]___[hash:base64:5]'
      : generateScopedName;
  } else {
    // small fallback
    scopedName = (local, filename) => {
      return Scope.generateScopedName(local, relative(context, filename));
    };
  }

  const plugins = (use || [
    ...prepend,
    Values,
    mode
      ? new LocalByDefault({mode})
      : LocalByDefault,
    createImportedName
      ? new ExtractImports({createImportedName})
      : ExtractImports,
    new Scope({generateScopedName: scopedName}),
    ...append,
  ]).concat(new Parser({fetch})); // no pushing in order to avoid the possible mutations;

  // https://github.com/postcss/postcss#options
  const runner = postcss(plugins);

  /**
   * @todo   think about replacing sequential fetch function calls with requires calls
   * @param  {string} _to
   * @param  {string} from
   * @return {object}
   */
  function fetch(_to, from) {
    // getting absolute path to the processing file
    const filename = /[^\\/?%*:|"<>\.]/i.test(_to[0])
      ? require.resolve(_to)
      : resolve(dirname(from), _to);

    // checking cache
    let tokens = tokensByFile[filename];
    if (tokens) {
      debugFetch(`${filename} → cache`);
      debugFetch(tokens);
      return tokens;
    }

    const source = preprocessCss(readFileSync(filename, 'utf8'), filename);
    // https://github.com/postcss/postcss/blob/master/docs/api.md#processorprocesscss-opts
    const lazyResult = runner.process(source, assign({}, processorOpts, {from: filename}));

    // https://github.com/postcss/postcss/blob/master/docs/api.md#lazywarnings
    lazyResult.warnings().forEach(message => console.warn(message.text));

    tokens = lazyResult.root.tokens;

    if (!debugMode) {
      // updating cache
      tokensByFile[filename] = tokens;
    } else {
      // clearing cache in development mode
      delete require.cache[filename];
    }

    if (processCss) {
      processCss(lazyResult.css, filename);
    }

    debugFetch(`${filename} → fs`);
    debugFetch(tokens);

    return tokens;
  };

  const exts = toArray(extensions);
  const isException = buildExceptionChecker(ignore);

  const hook = filename => {
    const tokens = fetch(filename, filename);
    return camelCase ? transformTokens(tokens, camelCase) : tokens;
  };

  // @todo add possibility to specify particular config for each extension
  exts.forEach(extension => attachHook(hook, extension, isException));
};

/**
 * @param  {*} option
 * @return {array}
 */
function toArray(option) {
  return Array.isArray(option)
    ? option
    : [option];
}

/**
 * @param  {function|regex|string} ignore glob, regex or function
 * @return {function}
 */
function buildExceptionChecker(ignore) {
  if (ignore instanceof RegExp) {
    return filepath => ignore.test(filepath);
  }

  if (typeof ignore === 'string') {
    return filepath => globToRegex(ignore).test(filepath);
  }

  return ignore || negate(identity);
}
