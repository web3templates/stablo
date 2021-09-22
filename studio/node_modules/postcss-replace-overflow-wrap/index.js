const postcss = require('postcss');

module.exports = postcss.plugin('postcss-replace-overflow-wrap', (opts) => {
    opts = opts || {};
    const method = opts.method || 'replace';

    return (css) => {
        css.walkDecls('overflow-wrap', (decl) => {
            decl.cloneBefore({ prop: 'word-wrap' });
            if (method === 'replace') {
                decl.remove();
            }
        });
    };
});
