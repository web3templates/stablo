var React = require('react');
var createReactClass = require('create-react-class');
var h = React.createElement;

module.exports = createReactClass({
    getDefaultProps: function() {
        return {
            string: '',
            highlight: ''
        };
    },
    shouldComponentUpdate: function(p) {
        return p.highlight !== this.props.highlight;
    },
    render: function() {
        var p = this.props,
            highlightStart = p.string.search(p.highlight);

        if (!p.highlight || highlightStart === -1) {
            return h('span', null, p.string);
        }
        var highlightLength = p.highlight.source.length,
            highlightString = p.string.substr(highlightStart, highlightLength);
        return h('span', null,
            p.string.split(p.highlight).map(function(part, index) {
                return h('span', { key: index },
                    index > 0 ?
                        h('span', { className: 'json-inspector__hl' }, highlightString) :
                        null,
                    part);
            }));
    }
});
