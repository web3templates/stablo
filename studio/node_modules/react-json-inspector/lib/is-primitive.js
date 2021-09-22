var type = require('./type');

function isPrimitive(value) {
    var t = type(value);
    return t !== 'Object' && t !== 'Array';
}

module.exports = isPrimitive;
