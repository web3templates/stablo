"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resetWarning = undefined;

var _postcss = require("postcss");

var _postcss2 = _interopRequireDefault(_postcss);

var _chalk = require("chalk");

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var shouldGlobalWarn = true;
var resetWarning = exports.resetWarning = function resetWarning() {
  return shouldGlobalWarn = true;
};

var warnForDeprecations = _postcss2.default.plugin("postcss-cssnext-warn-for-deprecations", function (_ref) {
  var messenger = _ref.console;

  return function (style) {
    // warn for removed @apply
    style.walkAtRules("apply", function () {
      if (shouldGlobalWarn) {
        shouldGlobalWarn = false;
        messenger.log(_chalk2.default.yellow.bold("You are using @apply rule and custom property sets. \n" + "This feature won't be included in the next major release " + "of postcss-cssnext. \n") + _chalk2.default.grey("This most likely won't get any more support from browser vendors as the " + "spec is yet considered deprecated and alternative solutions are being " + "discussed. \n") + "Read more about the reason here https://github.com/pascalduez/postcss-apply.");
      }
    });
  };
});

exports.default = warnForDeprecations;