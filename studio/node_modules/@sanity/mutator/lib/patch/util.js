"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.targetsToIndicies = targetsToIndicies;

function targetsToIndicies(targets, accessor) {
  var result = [];
  targets.forEach(target => {
    if (target.isIndexReference()) {
      result.push(...target.toIndicies(accessor));
    }
  });
  return result.sort();
}