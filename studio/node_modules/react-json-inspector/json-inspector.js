var React = require('react');
var createReactClass = require('create-react-class');
var PropTypes = require('prop-types');
var debounce = require('debounce');

var h = React.createElement;
var Leaf = require('./lib/leaf');
var SearchBar = require('./lib/search-bar');

var filterer = require('./lib/filterer');
var isEmpty = require('./lib/is-empty');
var lens = require('./lib/lens');
var noop = require('./lib/noop');

module.exports = createReactClass({
    propTypes: {
        data: PropTypes.any.isRequired,
        // For now it expects a factory function, not element.
        search: PropTypes.oneOfType([
            PropTypes.func,
            PropTypes.bool
        ]),
        searchOptions: PropTypes.shape({
            debounceTime: PropTypes.number
        }),
        onClick: PropTypes.func,
        validateQuery: PropTypes.func,
        isExpanded: PropTypes.func,
        filterOptions: PropTypes.shape({
            cacheResults: PropTypes.bool,
            ignoreCase: PropTypes.bool
        }),
        query: PropTypes.string,
        verboseShowOriginal: PropTypes.bool
    },
    getDefaultProps: function() {
        return {
            data: null,
            search: SearchBar,
            searchOptions: {
                debounceTime: 0
            },
            className: '',
            id: 'json-' + Date.now(),
            onClick: noop,
            filterOptions: {
                cacheResults: true,
                ignoreCase: false
            },
            validateQuery: function(query) {
                return query.length >= 2;
            },
            /**
             * Decide whether the leaf node at given `keypath` should be
             * expanded initially.
             * @param  {String} keypath
             * @param  {Any} value
             * @return {Boolean}
             */
            isExpanded: function(keypath, value) {
                return false;
            },
            verboseShowOriginal: false
        };
    },
    getInitialState: function() {
        return {
            query: this.props.query || ''
        };
    },
    render: function() {
        var p = this.props;
        var s = this.state;

        var isQueryValid = (
            s.query !== '' &&
            p.validateQuery(s.query)
        );

        var data = (
            isQueryValid ?
                s.filterer(s.query) :
                p.data
        );

        var isNotFound = (
            isQueryValid &&
            isEmpty(data)
        );

        return h('div', { className: 'json-inspector ' + p.className },
            this.renderToolbar(),
            (
                isNotFound ?
                    h('div', { className: 'json-inspector__not-found' }, 'Nothing found') :
                    h(Leaf, {
                        data: data,
                        onClick: p.onClick,
                        id: p.id,
                        getOriginal: this.getOriginal,
                        query: (
                            isQueryValid ?
                                new RegExp(
                                        s.query,
                                        (p.filterOptions.ignoreCase ? 'i' : '')
                                ) :
                                null
                        ),
                        label: 'root',
                        root: true,
                        isExpanded: p.isExpanded,
                        interactiveLabel: p.interactiveLabel,
                        verboseShowOriginal: p.verboseShowOriginal
                    })
            )
        );
    },
    renderToolbar: function() {
        var search = this.props.search;

        if (search) {
            return h('div', { className: 'json-inspector__toolbar' },
                h(search, {
                    onChange: debounce(this.search, this.props.searchOptions.debounceTime),
                    data: this.props.data,
                    query: this.state.query
                })
            );
        }
    },
    search: function(query) {
        this.setState({
            query: query
        });
    },
    componentWillMount: function() {
        this.createFilterer(this.props.data, this.props.filterOptions);
    },
    componentWillReceiveProps: function(p) {
        this.createFilterer(p.data, p.filterOptions);

        var isReceivingNewQuery = (
            typeof p.query === 'string' &&
            p.query !== this.state.query
        );

        if (isReceivingNewQuery) {
            this.setState({
                query: p.query
            });
        }
    },
    shouldComponentUpdate: function (p, s) {
        return (
            p.query !== this.props.query ||
            s.query !== this.state.query ||
            p.data !== this.props.data ||
            p.onClick !== this.props.onClick
        );
    },
    createFilterer: function(data, options) {
        this.setState({
            filterer: filterer(data, options)
        });
    },
    getOriginal: function(path) {
        return lens(this.props.data, path);
    }
});
