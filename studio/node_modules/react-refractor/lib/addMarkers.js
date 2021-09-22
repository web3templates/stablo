"use strict";

var filter = require('unist-util-filter');

var visit = require('unist-util-visit-parents');

var NodeMap = require('./map');

function lineNumberify(ast) {
  var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    lineNumber: 1
  };
  return ast.reduce(function (result, node) {
    var lineStart = context.lineNumber;

    if (node.type === 'text') {
      if (node.value.indexOf('\n') === -1) {
        node.lineStart = lineStart;
        node.lineEnd = lineStart;
        result.nodes.push(node);
        return result;
      }

      var lines = node.value.split('\n');

      for (var i = 0; i < lines.length; i++) {
        var lineNum = i === 0 ? context.lineNumber : ++context.lineNumber;
        result.nodes.push({
          type: 'text',
          value: i === lines.length - 1 ? lines[i] : "".concat(lines[i], "\n"),
          lineStart: lineNum,
          lineEnd: lineNum
        });
      }

      result.lineNumber = context.lineNumber;
      return result;
    }

    if (node.children) {
      var processed = lineNumberify(node.children, context);
      var firstChild = processed.nodes[0];
      var lastChild = processed.nodes[processed.nodes.length - 1];
      node.lineStart = firstChild ? firstChild.lineStart : lineStart;
      node.lineEnd = lastChild ? lastChild.lineEnd : lineStart;
      node.children = processed.nodes;
      result.lineNumber = processed.lineNumber;
      result.nodes.push(node);
      return result;
    }

    result.nodes.push(node);
    return result;
  }, {
    nodes: [],
    lineNumber: context.lineNumber
  });
}

function unwrapLine(markerLine, nodes) {
  var tree = {
    type: 'root',
    children: nodes
  };
  var headMap = new NodeMap();
  var lineMap = new NodeMap();
  var tailMap = new NodeMap();
  var cloned = [];

  function addCopy(map, node, ancestors) {
    cloned.push(node);
    ancestors.forEach(function (ancestor) {
      if (!map.has(ancestor)) {
        map.set(ancestor, Object.assign({}, ancestor, {
          children: []
        }));

        if (ancestor !== tree) {
          cloned.push(ancestor);
        }
      }
    });
    var i = ancestors.length;

    while (i--) {
      var ancestor = map.get(ancestors[i]);
      var child = ancestors[i + 1];
      var leaf = map.get(child) || node;

      if (ancestor.children.indexOf(leaf) === -1) {
        ancestor.children.push(leaf);
      }
    }
  }

  visit(tree, function (node, ancestors) {
    if (node.children) {
      return;
    } // These nodes are on previous lines, but nested within the same structure


    if (node.lineStart < markerLine) {
      addCopy(headMap, node, ancestors);
      return;
    } // These nodes are on the target line


    if (node.lineStart === markerLine) {
      addCopy(lineMap, node, ancestors);
      return;
    } // If we have shared ancestors with some of the cloned elements,
    // create another tree of the remaining nodes


    if (node.lineEnd > markerLine && cloned.some(function (clone) {
      return ancestors.indexOf(clone) !== -1;
    })) {
      addCopy(tailMap, node, ancestors);
    }
  }); // Get the remaining nodes - the ones who were not part of the same tree

  var filtered = filter(tree, function (node) {
    return cloned.indexOf(node) === -1;
  });

  var getChildren = function getChildren(map) {
    var rootNode = map.get(tree);

    if (!rootNode) {
      return [];
    }

    visit(rootNode, function (leaf, ancestors) {
      if (leaf.children) {
        leaf.lineStart = 0;
        leaf.lineEnd = 0;
        return;
      }

      ancestors.forEach(function (ancestor) {
        ancestor.lineStart = Math.max(ancestor.lineStart, leaf.lineStart);
        ancestor.lineEnd = Math.max(ancestor.lineEnd, leaf.lineEnd);
      });
    });
    return rootNode.children;
  };

  var merged = [].concat(getChildren(headMap), getChildren(lineMap), getChildren(tailMap), filtered ? filtered.children : []);
  headMap.clear();
  lineMap.clear();
  tailMap.clear();
  return merged;
}

function wrapBatch(children, marker, options) {
  var className = marker.className || 'refractor-marker';
  return {
    type: 'element',
    tagName: marker.component || 'div',
    properties: marker.component ? Object.assign({}, options, {
      className: className
    }) : {
      className: className
    },
    children: children,
    lineStart: marker.line,
    lineEnd: children[children.length - 1].lineEnd,
    isMarker: true
  };
}

function wrapLines(treeNodes, markers, options) {
  if (markers.length === 0 || treeNodes.length === 0) {
    return treeNodes;
  }

  var ast = markers.reduce(function (acc, marker) {
    return unwrapLine(marker.line, acc);
  }, treeNodes); // Container for the new AST

  var wrapped = []; // Note: Markers are already sorted by line number (ascending)

  var astIndex = 0;

  for (var m = 0; m < markers.length; m++) {
    var marker = markers[m]; // Start by eating all AST nodes with line numbers up to the given marker

    for (var node = ast[astIndex]; node && node.lineEnd < marker.line; node = ast[++astIndex]) {
      wrapped.push(node);
    } // Now proceed to find all _contiguous_ nodes on the same line


    var batch = [];

    for (var _node = ast[astIndex]; _node && _node.lineEnd === marker.line; _node = ast[++astIndex]) {
      batch.push(_node);
    } // Now add that batch, if we have anything


    if (batch.length > 0) {
      wrapped.push(wrapBatch(batch, marker, options));
    }
  } // Now add the remaining AST nodes


  while (astIndex < ast.length) {
    wrapped.push(ast[astIndex++]);
  }

  return wrapped;
}

function addMarkers(ast, options) {
  var markers = options.markers.map(function (marker) {
    return marker.line ? marker : {
      line: marker
    };
  }).sort(function (nodeA, nodeB) {
    return nodeA.line - nodeB.line;
  });
  var numbered = lineNumberify(ast).nodes;
  return wrapLines(numbered, markers, options);
}

module.exports = addMarkers;
//# sourceMappingURL=addMarkers.js.map