'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _entries = require('babel-runtime/core-js/object/entries');

var _entries2 = _interopRequireDefault(_entries);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _balancedMatch = require('balanced-match');

var _balancedMatch2 = _interopRequireDefault(_balancedMatch);

var _postcss = require('postcss');

var _postcss2 = _interopRequireDefault(_postcss);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
/* eslint-disable no-param-reassign */

var RE_PROP_SET = /^(--)([\w-]+)(\s*)([:]?)$/;

var Visitor = function Visitor(options) {
  var _this = this;

  _classCallCheck(this, Visitor);

  this.cache = {};
  this.result = {};
  this.options = {};
  this.defaults = {
    preserve: false,
    sets: {}
  };

  this.prepend = function () {
    var sets = _this.options.sets;

    // $FlowFixMe
    Object.keys(sets).forEach(function (setName) {
      var newRule = _postcss2.default.rule({ selector: `--${setName}` });

      // $FlowFixMe
      (0, _entries2.default)(sets[setName]).forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            prop = _ref2[0],
            value = _ref2[1];

        newRule.prepend(_postcss2.default.decl({ prop: (0, _utils2.default)(prop), value }));
      });

      _this.cache[setName] = newRule;
    });
  };

  this.collect = function (rule) {
    var matches = RE_PROP_SET.exec(rule.selector);

    if (!matches) {
      return;
    }

    var setName = matches[2];
    var parent = rule.parent;

    if (parent.selector !== ':root') {
      rule.warn(_this.result, 'Custom property set ignored: not scoped to top-level `:root` ' + `(--${setName}` + `${parent.type === 'rule' ? ` declared in ${parent.selector}` : ''})`);

      if (parent.type === 'root') {
        rule.remove();
      }

      return;
    }

    // Custom property sets override each other wholly,
    // rather than cascading together like colliding style rules do.
    // @see: https://tabatkins.github.io/specs/css-apply-rule/#defining
    var newRule = rule.clone();
    _this.cache[setName] = newRule;

    if (!_this.options.preserve) {
      safeRemoveRule(rule);
    }

    if (!parent.nodes.length) {
      parent.remove();
    }
  };

  this.resolveNested = function () {
    Object.keys(_this.cache).forEach(function (rule) {
      _this.cache[rule].walkAtRules('apply', function (atRule) {
        _this.resolve(atRule);

        // @TODO honor `preserve` option.
        atRule.remove();
      });
    });
  };

  this.resolve = function (atRule) {
    var ancestor = atRule.parent;

    while (ancestor && ancestor.type !== 'rule') {
      ancestor = ancestor.parent;
    }

    if (!ancestor) {
      atRule.warn(_this.result, 'The @apply rule can only be declared inside Rule type nodes.');

      atRule.remove();
      return;
    }

    if (isDefinition(atRule.parent)) {
      return;
    }

    var param = getParamValue(atRule.params);
    var matches = RE_PROP_SET.exec(param);

    if (!matches) {
      return;
    }

    var setName = matches[2];
    var parent = atRule.parent;

    if (!(setName in _this.cache)) {
      atRule.warn(_this.result, `No custom property set declared for \`${setName}\`.`);

      return;
    }

    var newRule = _this.cache[setName].clone();
    cleanIndent(newRule);

    if (_this.options.preserve) {
      parent.insertBefore(atRule, newRule.nodes);

      return;
    }

    atRule.replaceWith(newRule.nodes);
  };

  this.options = _extends({}, this.defaults, options);
}

/**
 * Prepend JS defined sets into the cache before parsing.
 * This means CSS defined sets will overrides them if they share the same name.
 */


/**
 * Collect all `:root` declared property sets and save them.
 */


/**
 * Replace nested `@apply` at-rules declarations.
 */


/**
 * Replace `@apply` at-rules declarations with provided custom property set.
 */
;

/**
 * Helper: return whether the rule is a custom property set definition.
 */


exports.default = Visitor;
function isDefinition(rule) {
  return !!rule.selector && RE_PROP_SET.exec(rule.selector) && rule.parent && !!rule.parent.selector && rule.parent.selector === ':root';
}

/**
 * Helper: allow parens usage in `@apply` AtRule declaration.
 * This is for Polymer integration.
 */
function getParamValue(param) {
  return (/^\(/.test(param) ? (0, _balancedMatch2.default)('(', ')', param).body : param
  );
}

/**
 * Helper: remove excessive declarations indentation.
 */
function cleanIndent(rule) {
  rule.walkDecls(function (decl) {
    if (typeof decl.raws.before === 'string') {
      decl.raws.before = decl.raws.before.replace(/[^\S\x0a\x0d]{2,}/, '  ');
    }
  });
}

/**
 * Helper: correctly handle property sets removal and semi-colons.
 * @See: postcss/postcss#1014
 */
function safeRemoveRule(rule) {
  if (rule === rule.parent.last && rule.raws.ownSemicolon) {
    rule.parent.raws.semicolon = true;
  }

  rule.remove();
}