var postcss = require('postcss');

module.exports = postcss.plugin('pseudoelements', (options) => {

  options = options || { single: true };

  var selectors = options.selectors || [
    'before',
    'after',
    'first-letter',
    'first-line'
  ]

  var replacements = new RegExp(':{1,}(' + selectors.join('|') + ')', 'gi');
	var replaceWith = options.single ? ':$1' : '::$1'

  return (css) => {
    css.walkRules((rule) => {
      rule.selector = rule.selector.replace(replacements, replaceWith);
  	});
  };
});
