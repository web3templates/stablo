"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyPatch = void 0;
var internal_patcher_1 = require("./internal-patcher");
var utf8_1 = require("./utf8");
var Model = {
    wrap: function (data) {
        return data;
    },
    finalize: function (b) {
        if (Array.isArray(b)) {
            return b;
        }
        else {
            return b.data;
        }
    },
    markChanged: function (value) {
        return value;
    },
    objectGetKeys: function (value) {
        return Object.keys(value);
    },
    objectGetField: function (value, key) {
        return value[key];
    },
    arrayGetElement: function (value, idx) {
        return value[idx];
    },
    copyObject: function (value) {
        var res = {
            type: 'object',
            data: {}
        };
        if (value !== null) {
            for (var _i = 0, _a = Object.entries(value); _i < _a.length; _i++) {
                var _b = _a[_i], key = _b[0], val = _b[1];
                res.data[key] = val;
            }
        }
        return res;
    },
    copyArray: function (value) {
        if (value === null)
            return [];
        return value.slice();
    },
    copyString: function (value) {
        return {
            type: 'string',
            data: value === null ? '' : value
        };
    },
    objectSetField: function (target, key, value) {
        target.data[key] = value;
    },
    objectDeleteField: function (target, key) {
        delete target.data[key];
    },
    arrayAppendValue: function (target, value) {
        target.push(value);
    },
    arrayAppendSlice: function (target, source, left, right) {
        target.push.apply(target, source.slice(left, right));
    },
    stringAppendSlice: function (target, source, left, right) {
        var sourceString = source;
        var leftPos = utf8_1.utf8resolveIndex(sourceString, left);
        var rightPos = utf8_1.utf8resolveIndex(sourceString, right, leftPos);
        target.data += sourceString.slice(leftPos, rightPos);
    },
    stringAppendValue: function (target, value) {
        target.data += value;
    }
};
// Applies a patch on a JavaScript object.
function applyPatch(left, patch) {
    var root = left; // No need to wrap because the representation is the same.
    var patcher = new internal_patcher_1.Patcher(Model, root, patch);
    return patcher.process();
}
exports.applyPatch = applyPatch;
//# sourceMappingURL=simple-patcher.js.map