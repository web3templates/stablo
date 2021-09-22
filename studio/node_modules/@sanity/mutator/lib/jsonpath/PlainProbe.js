"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// A default implementation of a probe for vanilla JS _values
class PlainProbe {
  constructor(_value, path) {
    _defineProperty(this, "_value", void 0);

    _defineProperty(this, "path", void 0);

    this._value = _value;
    this.path = path || [];
  }

  containerType() {
    if (Array.isArray(this._value)) {
      return 'array';
    } else if (this._value !== null && typeof this._value === 'object') {
      return 'object';
    }

    return 'primitive';
  }

  length() {
    if (this.containerType() !== 'array') {
      throw new Error("Won't return length of non-indexable _value");
    }

    return this._value.length;
  }

  getIndex(i) {
    if (this.containerType() !== 'array') {
      return false;
    }

    if (i >= this.length()) {
      return null;
    }

    return new PlainProbe(this._value[i], this.path.concat(i));
  }

  hasAttribute(key) {
    if (this.containerType() !== 'object') {
      return false;
    }

    return this._value.hasOwnProperty(key);
  }

  attributeKeys() {
    if (this.containerType() !== 'object') {
      return [];
    }

    return Object.keys(this._value);
  }

  getAttribute(key) {
    if (this.containerType() !== 'object') {
      throw new Error('getAttribute only applies to plain objects');
    }

    if (!this.hasAttribute(key)) {
      return null;
    }

    return new PlainProbe(this._value[key], this.path.concat(key));
  }

  get() {
    return this._value;
  }

}

exports.default = PlainProbe;