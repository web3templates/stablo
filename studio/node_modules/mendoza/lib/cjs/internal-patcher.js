"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Patcher = void 0;
var OPS = [
    'Value',
    'Copy',
    'Blank',
    'ReturnIntoArray',
    'ReturnIntoObject',
    'ReturnIntoObjectSameKey',
    'PushField',
    'PushElement',
    'PushParent',
    'Pop',
    'PushFieldCopy',
    'PushFieldBlank',
    'PushElementCopy',
    'PushElementBlank',
    'ReturnIntoObjectPop',
    'ReturnIntoObjectSameKeyPop',
    'ReturnIntoArrayPop',
    'ObjectSetFieldValue',
    'ObjectCopyField',
    'ObjectDeleteField',
    'ArrayAppendValue',
    'ArrayAppendSlice',
    'StringAppendString',
    'StringAppendSlice'
];
var Patcher = /** @class */ (function () {
    function Patcher(model, root, patch) {
        this.i = 0;
        this.inputStack = [];
        this.outputStack = [];
        this.model = model;
        this.root = root;
        this.patch = patch;
    }
    Patcher.prototype.read = function () {
        return this.patch[this.i++];
    };
    Patcher.prototype.process = function () {
        this.inputStack.push({ value: this.root });
        this.outputStack.push({ value: this.root });
        for (; this.i < this.patch.length;) {
            var opcode = this.read();
            var op = OPS[opcode];
            if (!op)
                throw new Error("Unknown opcode: " + opcode);
            var processor = "process" + op;
            this[processor].apply(this);
        }
        var entry = this.outputStack.pop();
        return this.finalizeOutput(entry);
    };
    Patcher.prototype.inputEntry = function () {
        return this.inputStack[this.inputStack.length - 1];
    };
    Patcher.prototype.inputKey = function (entry, idx) {
        if (!entry.keys) {
            entry.keys = this.model.objectGetKeys(entry.value).sort();
        }
        return entry.keys[idx];
    };
    Patcher.prototype.outputEntry = function () {
        return this.outputStack[this.outputStack.length - 1];
    };
    Patcher.prototype.outputArray = function () {
        var entry = this.outputEntry();
        if (!entry.writeValue) {
            entry.writeValue = this.model.copyArray(entry.value);
        }
        return entry.writeValue;
    };
    Patcher.prototype.outputObject = function () {
        var entry = this.outputEntry();
        if (!entry.writeValue) {
            entry.writeValue = this.model.copyObject(entry.value);
        }
        return entry.writeValue;
    };
    Patcher.prototype.outputString = function () {
        var entry = this.outputEntry();
        if (!entry.writeValue) {
            entry.writeValue = this.model.copyString(entry.value);
        }
        return entry.writeValue;
    };
    Patcher.prototype.finalizeOutput = function (entry) {
        if (entry.writeValue) {
            return this.model.finalize(entry.writeValue);
        }
        else {
            return entry.value;
        }
    };
    // Processors:
    Patcher.prototype.processValue = function () {
        var value = this.model.wrap(this.read());
        this.outputStack.push({ value: value });
    };
    Patcher.prototype.processCopy = function () {
        var input = this.inputEntry();
        this.outputStack.push({ value: input.value });
    };
    Patcher.prototype.processBlank = function () {
        this.outputStack.push({ value: null });
    };
    Patcher.prototype.processReturnIntoArray = function () {
        var entry = this.outputStack.pop();
        var result = this.finalizeOutput(entry);
        var arr = this.outputArray();
        this.model.arrayAppendValue(arr, result);
    };
    Patcher.prototype.processReturnIntoObject = function () {
        var key = this.read();
        var entry = this.outputStack.pop();
        var result = this.finalizeOutput(entry);
        result = this.model.markChanged(result);
        var obj = this.outputObject();
        this.model.objectSetField(obj, key, result);
    };
    Patcher.prototype.processReturnIntoObjectSameKey = function () {
        var input = this.inputEntry();
        var entry = this.outputStack.pop();
        var result = this.finalizeOutput(entry);
        var obj = this.outputObject();
        this.model.objectSetField(obj, input.key, result);
    };
    Patcher.prototype.processPushField = function () {
        var idx = this.read();
        var entry = this.inputEntry();
        var key = this.inputKey(entry, idx);
        var value = this.model.objectGetField(entry.value, key);
        this.inputStack.push({ value: value, key: key });
    };
    Patcher.prototype.processPushElement = function () {
        var idx = this.read();
        var entry = this.inputEntry();
        var value = this.model.arrayGetElement(entry.value, idx);
        this.inputStack.push({ value: value });
    };
    Patcher.prototype.processPop = function () {
        this.inputStack.pop();
    };
    Patcher.prototype.processPushFieldCopy = function () {
        this.processPushField();
        this.processCopy();
    };
    Patcher.prototype.processPushFieldBlank = function () {
        this.processPushField();
        this.processBlank();
    };
    Patcher.prototype.processPushElementCopy = function () {
        this.processPushElement();
        this.processCopy();
    };
    Patcher.prototype.processPushElementBlank = function () {
        this.processPushElement();
        this.processBlank();
    };
    Patcher.prototype.processReturnIntoObjectPop = function () {
        this.processReturnIntoObject();
        this.processPop();
    };
    Patcher.prototype.processReturnIntoObjectSameKeyPop = function () {
        this.processReturnIntoObjectSameKey();
        this.processPop();
    };
    Patcher.prototype.processReturnIntoArrayPop = function () {
        this.processReturnIntoArray();
        this.processPop();
    };
    Patcher.prototype.processObjectSetFieldValue = function () {
        this.processValue();
        this.processReturnIntoObject();
    };
    Patcher.prototype.processObjectCopyField = function () {
        this.processPushField();
        this.processCopy();
        this.processReturnIntoObjectSameKey();
        this.processPop();
    };
    Patcher.prototype.processObjectDeleteField = function () {
        var idx = this.read();
        var entry = this.inputEntry();
        var key = this.inputKey(entry, idx);
        var obj = this.outputObject();
        this.model.objectDeleteField(obj, key);
    };
    Patcher.prototype.processArrayAppendValue = function () {
        var value = this.model.wrap(this.read());
        var arr = this.outputArray();
        this.model.arrayAppendValue(arr, value);
    };
    Patcher.prototype.processArrayAppendSlice = function () {
        var left = this.read();
        var right = this.read();
        var str = this.outputArray();
        var val = this.inputEntry().value;
        this.model.arrayAppendSlice(str, val, left, right);
    };
    Patcher.prototype.processStringAppendString = function () {
        var value = this.model.wrap(this.read());
        var str = this.outputString();
        this.model.stringAppendValue(str, value);
    };
    Patcher.prototype.processStringAppendSlice = function () {
        var left = this.read();
        var right = this.read();
        var str = this.outputString();
        var val = this.inputEntry().value;
        this.model.stringAppendSlice(str, val, left, right);
    };
    return Patcher;
}());
exports.Patcher = Patcher;
//# sourceMappingURL=internal-patcher.js.map