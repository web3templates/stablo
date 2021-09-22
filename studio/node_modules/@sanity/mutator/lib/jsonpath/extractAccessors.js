"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = extract;

var _compact2 = _interopRequireDefault(require("lodash/compact"));

var _jsonpath = require("../jsonpath");

var _PlainProbe = _interopRequireDefault(require("./PlainProbe"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function extract(path, value) {
  var result = [];

  var appendResult = values => {
    result.push(...values);
  };

  var matcher = _jsonpath.Matcher.fromPath(path).setPayload(appendResult);

  var accessor = new _PlainProbe.default(value);
  descend(matcher, accessor);
  return result;
}

function descend(matcher, accessor) {
  var _matcher$match = matcher.match(accessor),
      leads = _matcher$match.leads,
      delivery = _matcher$match.delivery;

  leads.forEach(lead => {
    accessorsFromTarget(lead.target, accessor).forEach(childAccessor => {
      descend(lead.matcher, childAccessor);
    });
  });

  if (delivery) {
    delivery.targets.forEach(target => {
      delivery.payload(accessorsFromTarget(target, accessor));
    });
  }
}

function accessorsFromTarget(target, accessor) {
  var result = [];

  if (target.isIndexReference()) {
    target.toIndicies(accessor).forEach(i => {
      result.push(accessor.getIndex(i));
    });
  } else if (target.isAttributeReference()) {
    result.push(accessor.getAttribute(target.name()));
  } else if (target.isSelfReference()) {
    result.push(accessor);
  } else {
    throw new Error("Unable to derive accessor for target ".concat(target.toString()));
  }

  return (0, _compact2.default)(result);
}