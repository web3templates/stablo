"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = descend;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// Splits an expression into a set of heads, tails. A head is the next leaf node to
// check for matches, and a tail is everything that follows it. Matching is done by
// matching heads, then proceedint to the matching value, splitting the tail into
// heads and tails and checking the heads against the new value, and so on.
// expands an expression into one or more head/tail pairs
function descend(tail) {
  return spreadIfUnionHead(...splitIfPath(tail));
} // Split path in [head, tail]


function splitIfPath(tail) {
  if (tail.type !== 'path') {
    return [tail, null];
  }

  var nodes = tail.nodes;

  if (nodes.length === 0) {
    return [null, null];
  } else if (nodes.length === 1) {
    return [nodes[0], null];
  }

  return [nodes[0], {
    type: 'path',
    nodes: nodes.slice(1)
  }];
}

function concatPaths(path1, path2) {
  if (!path1 && !path2) {
    return null;
  }

  var nodes1 = path1 ? path1.nodes : [];
  var nodes2 = path2 ? path2.nodes : [];
  return {
    type: 'path',
    nodes: nodes1.concat(nodes2)
  };
} // Spreads a union head into several heads/tails


function spreadIfUnionHead(head, tail) {
  if (head.type !== 'union') {
    return [[head, tail]];
  }

  return head.nodes.map(node => {
    if (node.type === 'path') {
      var _splitIfPath = splitIfPath(node),
          _splitIfPath2 = _slicedToArray(_splitIfPath, 2),
          subHead = _splitIfPath2[0],
          subTail = _splitIfPath2[1];

      return [subHead, concatPaths(subTail, tail)];
    }

    return [node, tail];
  });
}