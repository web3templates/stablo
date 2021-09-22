// Filename: formurlencoded.js
// Timestamp: 2017.07.04-19:19:11 (last modified)
// Author(s): Bumblehead (www.bumblehead.com), JBlashill (james@blashill.com), Jumper423 (jump.e.r@yandex.ru)

module.exports = (data, opts = {}) => {
    const sorted = Boolean(opts.sorted),
        skipIndex = Boolean(opts.skipIndex),
        ignorenull = Boolean(opts.ignorenull),

        encode = value => String(value)
            .replace(/[^ !'()~\*]/gu, encodeURIComponent)
            .replace(/ /g, '+')
            .replace(/[!'()~\*]/g, ch =>
                '%' + ch.charCodeAt().toString(16).slice(-2).toUpperCase()),

        keys = (obj, keyarr = Object.keys(obj)) =>
            sorted ? keyarr.sort() : keyarr,

        filterjoin = arr => arr.filter(e => e).join('&'),

        objnest = (name, obj) =>
            filterjoin(keys(obj).map(key =>
                nest(name + '[' + key + ']', obj[key]))),

        arrnest = (name, arr) => arr.length
            ? filterjoin(arr.map((elem, index) => skipIndex
                ? nest(name + '[]', elem)
                : nest(name + '[' + index + ']', elem)))
            : encode(name + '[]'),

        nest = (name, value, type = typeof value, f = null) => {
            if (value === f)
                f = ignorenull ? f : encode(name) + '=' + f;
            else if (/string|number|boolean/.test(type))
                f = encode(name) + '=' + encode(value);
            else if (Array.isArray(value))
                f = arrnest(name, value);
            else if (type === 'object')
                f = objnest(name, value);

            return f;
        };

    return data && filterjoin(keys(data).map(key => nest(key, data[key])));
};
