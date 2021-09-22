'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// Filename: formurlencoded.js
// Timestamp: 2017.07.04-19:19:11 (last modified)
// Author(s): Bumblehead (www.bumblehead.com), JBlashill (james@blashill.com), Jumper423 (jump.e.r@yandex.ru)

module.exports = function (data) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var sorted = Boolean(opts.sorted),
        skipIndex = Boolean(opts.skipIndex),
        ignorenull = Boolean(opts.ignorenull),
        encode = function encode(value) {
        return String(value).replace(/(?:[\0-\x1F"-&\+-\}\x7F-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/g, encodeURIComponent).replace(/ /g, '+').replace(/[!'()~\*]/g, function (ch) {
            return '%' + ch.charCodeAt().toString(16).slice(-2).toUpperCase();
        });
    },
        keys = function keys(obj) {
        var keyarr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Object.keys(obj);
        return sorted ? keyarr.sort() : keyarr;
    },
        filterjoin = function filterjoin(arr) {
        return arr.filter(function (e) {
            return e;
        }).join('&');
    },
        objnest = function objnest(name, obj) {
        return filterjoin(keys(obj).map(function (key) {
            return nest(name + '[' + key + ']', obj[key]);
        }));
    },
        arrnest = function arrnest(name, arr) {
        return arr.length ? filterjoin(arr.map(function (elem, index) {
            return skipIndex ? nest(name + '[]', elem) : nest(name + '[' + index + ']', elem);
        })) : encode(name + '[]');
    },
        nest = function nest(name, value) {
        var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : typeof value === 'undefined' ? 'undefined' : _typeof(value);
        var f = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

        if (value === f) f = ignorenull ? f : encode(name) + '=' + f;else if (/string|number|boolean/.test(type)) f = encode(name) + '=' + encode(value);else if (Array.isArray(value)) f = arrnest(name, value);else if (type === 'object') f = objnest(name, value);

        return f;
    };

    return data && filterjoin(keys(data).map(function (key) {
        return nest(key, data[key]);
    }));
};