'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var postcss = _interopDefault(require('postcss'));

// tooling
// plugin
var index = postcss.plugin('postcss-system-ui-font', function (opts) {
	var familyOpt = Object(opts).family;

	var systemUiFamily = typeof familyOpt === 'string' ? familyOpt.trim().split(/\s*,\s*/) : familyOpt || ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Droid Sans', 'Helvetica Neue'];

	// system-ui and fallbacks match
	var whitespace = '[\\f\\n\\r\\x09\\x20]';
	var systemUiMatch = new RegExp(`(^|,|${whitespace}+)(?:system-ui${whitespace}*)(?:,${whitespace}*(?:${systemUiFamily.join('|')})${whitespace}*)?(,|$)`, 'i');

	// system-ui fallback replacement
	var systemUiReplace = `$1${systemUiFamily.join(', ')}$2`;

	return function (root) {
		// update font declarations to polyfill system-ui usage
		root.walkDecls(fontPropertyMatch, function (decl) {
			decl.value = decl.value.replace(systemUiMatch, systemUiReplace);
		});
	};
});

// font and font family property match
var fontPropertyMatch = /^font(-family)?$/i;

module.exports = index;
