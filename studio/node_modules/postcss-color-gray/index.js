'use strict';

const color = require('color');
const postcss = require('postcss');
const helpers = require('postcss-message-helpers');
const reduceFunctionCall = require('reduce-function-call');

const pluginName = 'postcss-color-gray';
const errorContext = {plugin: pluginName};

function parseAlpha(alpha) {
	if (alpha) {
		const match = alpha.match(/^\d(\d|\.)+?%$/);

		if (match && match[0] === alpha) {
			return parseFloat(alpha) * 0.01;
		}
	}

	return alpha;
}

function parseGray(decl) {
	return reduceFunctionCall(decl.value, 'gray', body => {
		if (body.startsWith(',') || body.endsWith(',')) {
			throw decl.error(`Unable to parse color from string "gray(${body})"`, errorContext);
		}

		const args = postcss.list.comma(body);
		const lightness = args[0];
		const alpha = parseAlpha(args[1]);
		const rgb = `${lightness},${lightness},${lightness}`;

		try {
			return color(alpha ? `rgba(${rgb},${alpha})` : `rgb(${rgb})`).rgb().string();
		} catch (err) {
			throw decl.error(`Unable to parse color from string "gray(${args})"`, errorContext);
		}
	});
}

module.exports = postcss.plugin(pluginName, () => function(root) {
	root.walkDecls(function(decl) {
		if (decl.value && decl.value.includes('gray(')) {
			decl.value = helpers.try(parseGray.bind(this, decl), decl.source);
		}
	});
});
