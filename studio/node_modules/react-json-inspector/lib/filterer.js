var assign = require('object-assign');
var keys = Object.keys;

var isPrimitive = require('./is-primitive');
var isEmpty = require('./is-empty');

module.exports = function(data, options) {
    options || (options = { cacheResults: true });

    var cache = {};

    return function(query) {
        if (!options.cacheResults) {
           return find(data, query, options);
        }

        var subquery;

        if (!cache[query]) {
            for (var i = query.length - 1; i > 0; i -= 1) {
                subquery = query.substr(0, i);

                if (cache[subquery]) {
                    cache[query] = find(cache[subquery], query, options);
                    break;
                }
            }
        }

        if (!cache[query]) {
            cache[query] = find(data, query, options);
        }

        return cache[query];
    };
};

function find(data, query, options) {
    return keys(data).reduce(function(acc, key) {
        var value = data[key];
        var matches;

        if (isPrimitive(value)) {
            if (contains(query, key, options) || contains(query, value, options)) {
                acc[key] = value;
            }
        } else {
            if (contains(query, key, options)) {
                acc[key] = value;
            } else {
                matches = find(value, query, options);

                if (!isEmpty(matches)) {
                    assign(acc, pair(key, matches));
                }
            }
        }

        return acc;
    }, {});
}

function contains(query, string, options) {
    if (string) {
        var haystack = String(string);
        var needle = query;

        if (options.ignoreCase) {
            haystack = haystack.toLowerCase();
            needle = needle.toLowerCase();
        }

        return haystack.indexOf(needle) !== -1;
    }
}

function pair(key, value) {
    var p = {};
    p[key] = value;
    return p;
}
