"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useCssProp = exports.usePureAnnotation = exports.useNamespace = exports.useTranspileTemplateLiterals = exports.useMinify = exports.useFileName = exports.useSSR = exports.useTopLevelImportPaths = exports.useDisplayName = void 0;

function getOption({
  opts
}, name, defaultValue = true) {
  return opts[name] === undefined || opts[name] === null ? defaultValue : opts[name];
}

const useDisplayName = state => getOption(state, 'displayName');

exports.useDisplayName = useDisplayName;

const useTopLevelImportPaths = state => getOption(state, 'topLevelImportPaths', []);

exports.useTopLevelImportPaths = useTopLevelImportPaths;

const useSSR = state => getOption(state, 'ssr', true);

exports.useSSR = useSSR;

const useFileName = state => getOption(state, 'fileName');

exports.useFileName = useFileName;

const useMinify = state => getOption(state, 'minify');

exports.useMinify = useMinify;

const useTranspileTemplateLiterals = state => getOption(state, 'transpileTemplateLiterals');

exports.useTranspileTemplateLiterals = useTranspileTemplateLiterals;

const useNamespace = state => {
  const namespace = getOption(state, 'namespace', '');

  if (namespace) {
    return `${namespace}__`;
  }

  return '';
};

exports.useNamespace = useNamespace;

const usePureAnnotation = state => getOption(state, 'pure', false);

exports.usePureAnnotation = usePureAnnotation;

const useCssProp = state => getOption(state, 'cssProp', true);

exports.useCssProp = useCssProp;