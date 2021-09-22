import { Patcher } from './internal-patcher';
import { utf8charSize, utf8stringSize, commonPrefix, commonSuffix } from './utf8';
var Model = /** @class */ (function () {
    function Model(meta) {
        this.meta = meta;
    }
    Model.prototype.wrap = function (data) {
        return this.wrapWithMeta(data, this.meta, this.meta);
    };
    Model.prototype.wrapWithMeta = function (data, startMeta, endMeta) {
        if (endMeta === void 0) { endMeta = this.meta; }
        return { data: data, startMeta: startMeta, endMeta: endMeta };
    };
    Model.prototype.asObject = function (value) {
        if (!value.content) {
            var fields = {};
            for (var _i = 0, _a = Object.entries(value.data); _i < _a.length; _i++) {
                var _b = _a[_i], key = _b[0], val = _b[1];
                fields[key] = this.wrapWithMeta(val, value.startMeta);
            }
            value.content = { type: 'object', fields: fields };
        }
        return value.content;
    };
    Model.prototype.asArray = function (value) {
        var _this = this;
        if (!value.content) {
            var elements = value.data.map(function (item) { return _this.wrapWithMeta(item, value.startMeta); });
            var metas = elements.map(function () { return _this.meta; });
            value.content = { type: 'array', elements: elements, metas: metas };
        }
        return value.content;
    };
    Model.prototype.asString = function (value) {
        if (!value.content) {
            var str = value.data;
            var part = {
                value: str,
                utf8size: utf8stringSize(str),
                uses: [],
                startMeta: value.startMeta,
                endMeta: value.endMeta
            };
            value.content = this.stringFromParts([part]);
        }
        return value.content;
    };
    Model.prototype.stringFromParts = function (parts) {
        var str = {
            type: 'string',
            parts: parts
        };
        for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
            var part = parts_1[_i];
            part.uses.push(str);
        }
        return str;
    };
    Model.prototype.objectGetKeys = function (value) {
        if (value.content) {
            return Object.keys(value.content.fields);
        }
        else {
            return Object.keys(value.data);
        }
    };
    Model.prototype.objectGetField = function (value, key) {
        var obj = this.asObject(value);
        return obj.fields[key];
    };
    Model.prototype.arrayGetElement = function (value, idx) {
        var arr = this.asArray(value);
        return arr.elements[idx];
    };
    Model.prototype.finalize = function (content) {
        this.updateEndMeta(content);
        return { content: content, startMeta: this.meta, endMeta: this.meta };
    };
    Model.prototype.markChanged = function (value) {
        return this.wrap(unwrap(value));
    };
    Model.prototype.updateEndMeta = function (content) {
        if (content.type == 'string') {
            for (var _i = 0, _a = content.parts; _i < _a.length; _i++) {
                var part = _a[_i];
                part.endMeta = this.meta;
            }
        }
        else {
            if (content.type === 'array') {
                for (var _b = 0, _c = content.elements; _b < _c.length; _b++) {
                    var val = _c[_b];
                    if (val.content && val.endMeta !== this.meta) {
                        this.updateEndMeta(val.content);
                    }
                    val.endMeta = this.meta;
                }
            }
            else {
                for (var _d = 0, _e = Object.values(content.fields); _d < _e.length; _d++) {
                    var val = _e[_d];
                    if (val.content && val.endMeta !== this.meta) {
                        this.updateEndMeta(val.content);
                    }
                    val.endMeta = this.meta;
                }
            }
        }
    };
    Model.prototype.copyString = function (value) {
        if (value) {
            var other = this.asString(value);
            return this.stringFromParts(other.parts.slice());
        }
        else {
            return {
                type: 'string',
                parts: []
            };
        }
    };
    Model.prototype.copyObject = function (value) {
        var obj = {
            type: 'object',
            fields: {}
        };
        if (value) {
            var other = this.asObject(value);
            Object.assign(obj.fields, other.fields);
        }
        return obj;
    };
    Model.prototype.copyArray = function (value) {
        var arr = value ? this.asArray(value) : null;
        var elements = arr ? arr.elements : [];
        var metas = arr ? arr.metas : [];
        return {
            type: 'array',
            elements: elements,
            metas: metas
        };
    };
    Model.prototype.objectSetField = function (target, key, value) {
        target.fields[key] = value;
    };
    Model.prototype.objectDeleteField = function (target, key) {
        delete target.fields[key];
    };
    Model.prototype.arrayAppendValue = function (target, value) {
        target.elements.push(value);
        target.metas.push(this.meta);
    };
    Model.prototype.arrayAppendSlice = function (target, source, left, right) {
        var _a, _b;
        var arr = this.asArray(source);
        var samePosition = arr.elements.length === left;
        (_a = target.elements).push.apply(_a, arr.elements.slice(left, right));
        if (samePosition) {
            (_b = target.metas).push.apply(_b, arr.metas.slice(left, right));
        }
        else {
            for (var i = left; i < right; i++) {
                target.metas.push(this.meta);
            }
        }
    };
    Model.prototype.stringAppendValue = function (target, value) {
        var str = this.asString(value);
        for (var _i = 0, _a = str.parts; _i < _a.length; _i++) {
            var part = _a[_i];
            this.stringAppendPart(target, part);
        }
    };
    Model.prototype.stringAppendPart = function (target, part) {
        target.parts.push(part);
        part.uses.push(target);
    };
    Model.prototype.resolveStringPart = function (str, from, len) {
        if (len === 0)
            return from;
        for (var i = from; i < str.parts.length; i++) {
            var part = str.parts[i];
            if (len === part.utf8size) {
                // Matches perfect!
                return i + 1;
            }
            if (len < part.utf8size) {
                // It's a part of this chunk. We now need to split it up.
                this.splitString(part, len);
                return i + 1;
            }
            len -= part.utf8size;
        }
        throw new Error('splitting string out of bounds');
    };
    Model.prototype.splitString = function (part, idx) {
        var leftValue;
        var rightValue;
        var leftSize = idx;
        var rightSize = part.utf8size - leftSize;
        // idx is here in UTF-8 index, not codepoint index.
        // This means we might to adjust for multi-byte characters.
        if (part.utf8size !== part.value.length) {
            var byteCount = 0;
            for (idx = 0; byteCount < leftSize; idx++) {
                var code = part.value.codePointAt(idx);
                var size = utf8charSize(code);
                if (size === 4)
                    idx++; // Surrogate pair.
                byteCount += size;
            }
        }
        leftValue = part.value.slice(0, idx);
        rightValue = part.value.slice(idx);
        var newPart = {
            value: rightValue,
            utf8size: rightSize,
            uses: part.uses.slice(),
            startMeta: part.startMeta,
            endMeta: part.endMeta
        };
        part.value = leftValue;
        part.utf8size = leftSize;
        for (var _i = 0, _a = part.uses; _i < _a.length; _i++) {
            var use = _a[_i];
            // Insert the new part.
            var idx_1 = use.parts.indexOf(part);
            if (idx_1 === -1)
                throw new Error('bug: mismatch between string parts and use.');
            use.parts.splice(idx_1 + 1, 0, newPart);
        }
    };
    Model.prototype.stringAppendSlice = function (target, source, left, right) {
        var str = this.asString(source);
        var firstPart = this.resolveStringPart(str, 0, left);
        var lastPart = this.resolveStringPart(str, firstPart, right - left);
        for (var i = firstPart; i < lastPart; i++) {
            var part = str.parts[i];
            this.stringAppendPart(target, part);
        }
    };
    return Model;
}());
// Turns a native JavaScript object into a Value with a given origin.
export function wrap(data, meta) {
    return { data: data, startMeta: meta, endMeta: meta };
}
// Converts a Value into a native JavaScript type.
export function unwrap(value) {
    if (typeof value.data !== 'undefined')
        return value.data;
    var result;
    var content = value.content;
    switch (content.type) {
        case 'string':
            result = content.parts.map(function (part) { return part.value; }).join('');
            break;
        case 'array':
            result = content.elements.map(function (val) { return unwrap(val); });
            break;
        case 'object': {
            result = {};
            for (var _i = 0, _a = Object.entries(content.fields); _i < _a.length; _i++) {
                var _b = _a[_i], key = _b[0], val = _b[1];
                result[key] = unwrap(val);
            }
        }
    }
    value.data = result;
    return result;
}
// Returns the type of a Value.
export function getType(value) {
    if (value.content)
        return value.content.type;
    if (Array.isArray(value.data))
        return 'array';
    if (value.data === null)
        return 'null';
    return typeof value.data;
}
// Updates the `right` value such that it reuses as much as possible from the `left` value.
export function rebaseValue(left, right) {
    var leftType = getType(left);
    var rightType = getType(right);
    if (leftType !== rightType)
        return right;
    var leftModel = new Model(left.endMeta);
    var rightModel = new Model(right.endMeta);
    switch (leftType) {
        case 'object': {
            var leftObj = leftModel.asObject(left);
            var rightObj = rightModel.asObject(right);
            // Number of fields which are identical in left and right.
            var identicalFieldCount = 0;
            var leftFieldCount = Object.keys(leftObj.fields).length;
            var rightFieldCount = Object.keys(rightObj.fields).length;
            for (var _i = 0, _a = Object.entries(rightObj.fields); _i < _a.length; _i++) {
                var _b = _a[_i], key = _b[0], rightVal = _b[1];
                var leftVal = leftObj.fields[key];
                if (leftVal) {
                    rightObj.fields[key] = rebaseValue(leftVal, rightVal);
                    if (rightObj.fields[key] === leftVal) {
                        identicalFieldCount++;
                    }
                }
            }
            var isIdentical = leftFieldCount === rightFieldCount && leftFieldCount === identicalFieldCount;
            return isIdentical ? left : right;
        }
        case 'array': {
            var leftArr = leftModel.asArray(left);
            var rightArr = rightModel.asArray(right);
            if (leftArr.elements.length !== rightArr.elements.length) {
                break;
            }
            var numRebased = 0;
            for (var i = 0; i < rightArr.elements.length; i++) {
                rightArr.elements[i] = rebaseValue(leftArr.elements[i], rightArr.elements[i]);
                if (rightArr.elements[i] !== leftArr.elements[i]) {
                    numRebased++;
                }
            }
            return numRebased === 0 ? left : right;
        }
        case 'null':
        case 'boolean':
        case 'number': {
            if (unwrap(left) === unwrap(right))
                return left;
            break;
        }
        case 'string': {
            var leftRaw = unwrap(left);
            var rightRaw = unwrap(right);
            if (leftRaw === rightRaw)
                return left;
            var result = rightModel.copyString(null);
            var prefix = commonPrefix(leftRaw, rightRaw);
            var suffix = commonSuffix(leftRaw, rightRaw, prefix);
            var rightLen = utf8stringSize(rightRaw);
            var leftLen = utf8stringSize(leftRaw);
            if (0 < prefix) {
                rightModel.stringAppendSlice(result, left, 0, prefix);
            }
            if (prefix < rightLen - suffix) {
                rightModel.stringAppendSlice(result, right, prefix, rightLen - suffix);
            }
            if (leftLen - suffix < leftLen) {
                rightModel.stringAppendSlice(result, left, leftLen - suffix, leftLen);
            }
            var value = rightModel.finalize(result);
            if (unwrap(value) !== rightRaw)
                throw new Error('incorrect string rebase');
            return value;
        }
    }
    return right;
}
export function applyPatch(left, patch, startMeta) {
    var model = new Model(startMeta);
    var patcher = new Patcher(model, left, patch);
    return patcher.process();
}
//# sourceMappingURL=incremental-patcher.js.map