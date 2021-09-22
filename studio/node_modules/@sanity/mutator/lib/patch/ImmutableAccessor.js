"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// An immutable probe/writer for plain JS objects that will never mutate
// the provided _value in place. Each setter returns a new (wrapped) version
// of the value.
class ImmutableAccessor {
  constructor(_value, path) {
    _defineProperty(this, "_value", void 0);

    _defineProperty(this, "path", void 0);

    this._value = _value;
    this.path = path || [];
  }

  containerType() {
    if (Array.isArray(this._value)) {
      return 'array';
    } else if (this._value !== null && typeof this._value == 'object') {
      return 'object';
    }

    return 'primitive';
  } // Common reader, supported by all containers


  get() {
    return this._value;
  } // Array reader


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

    return new ImmutableAccessor(this._value[i], this.path.concat(i));
  } // Object reader


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

    return new ImmutableAccessor(this._value[key], this.path.concat(key));
  } // Common writer, supported by all containers


  set(value) {
    if (value === this._value) {
      return this;
    }

    return new ImmutableAccessor(value, this.path);
  }

  setAccessor(accessor) {
    return accessor;
  } // array writer interface


  setIndex(i, value) {
    if (value === this._value[i]) {
      return this;
    }

    var nextValue = this._value.slice();

    nextValue[i] = value;
    return new ImmutableAccessor(nextValue, this.path);
  }

  setIndexAccessor(i, accessor) {
    return this.setIndex(i, accessor.get());
  }

  unsetIndices(indices) {
    var length = this._value.length;
    var nextValue = []; // Copy every _value _not_ in the indices array over to the newValue

    for (var i = 0; i < length; i++) {
      if (indices.indexOf(i) === -1) {
        nextValue.push(this._value[i]);
      }
    }

    return new ImmutableAccessor(nextValue, this.path);
  }

  insertItemsAt(pos, items) {
    var nextValue;

    if (this.length() === 0 && pos === 0) {
      nextValue = items;
    } else {
      nextValue = this._value.slice(0, pos).concat(items).concat(this._value.slice(pos));
    }

    return new ImmutableAccessor(nextValue, this.path);
  } // Object writer interface


  setAttribute(key, value) {
    if (this.containerType() !== 'object') {
      throw new Error('Unable to set attribute of non-object container');
    }

    if (value === this._value[key]) {
      return this;
    }

    var nextValue = Object.assign({}, this._value);
    nextValue[key] = value;
    return new ImmutableAccessor(nextValue, this.path);
  }

  setAttributeAccessor(key, accessor) {
    return this.setAttribute(key, accessor.get());
  }

  unsetAttribute(key) {
    if (this.containerType() != 'object') {
      throw new Error('Unable to unset attribute of non-object container');
    }

    var nextValue = Object.assign({}, this._value);
    delete nextValue[key];
    return new ImmutableAccessor(nextValue, this.path);
  } // primitive writer interface


  mutate(fn) {
    if (this.containerType() != 'primitive') {
      throw new Error("Won't mutate container types");
    }

    var nextValue = fn(this._value);
    return new ImmutableAccessor(nextValue, this.path);
  }

}

exports.default = ImmutableAccessor;