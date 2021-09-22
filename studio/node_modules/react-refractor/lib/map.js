"use strict";

/**
 * Weird "map" polyfill, that's weak if possible
 */
module.exports = typeof WeakMap === 'function' ? HappyMap : SadMap; // Happy path! Fakes a `clear()` if possible (noop)

function HappyMap() {
  this.map = new WeakMap();
}

HappyMap.prototype.has = function (key) {
  return this.map.has(key);
};

HappyMap.prototype.set = function (key, value) {
  this.map.set(key, value);
  return this;
};

HappyMap.prototype.get = function (key) {
  return this.map.get(key);
};

HappyMap.prototype.clear = function () {// intentional noop, since we dont need to/cant clear
}; // Sad path! Use less stylish approach


function SadMap() {
  this.keys = [];
  this.values = [];
}

SadMap.prototype.has = function (key) {
  return this.keys.indexOf(key) !== -1;
};

SadMap.prototype.set = function (key, value) {
  var index = this.keys.indexOf(key);

  if (index === -1) {
    this.keys.push(key);
    this.values.push(value);
  } else {
    this.values[index] = value;
  }

  return this;
};

SadMap.prototype.get = function (key) {
  var index = this.keys.indexOf(key);
  return index === -1 ? undefined : this.values[index];
};

SadMap.prototype.clear = function () {
  this.keys = [];
  this.values = [];
};
//# sourceMappingURL=map.js.map