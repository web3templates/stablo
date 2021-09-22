const filter = require('unist-util-filter')
const visit = require('unist-util-visit-parents')
const NodeMap = require('./map')

function lineNumberify(ast, context = {lineNumber: 1}) {
  return ast.reduce(
    (result, node) => {
      const lineStart = context.lineNumber

      if (node.type === 'text') {
        if (node.value.indexOf('\n') === -1) {
          node.lineStart = lineStart
          node.lineEnd = lineStart
          result.nodes.push(node)
          return result
        }

        const lines = node.value.split('\n')
        for (let i = 0; i < lines.length; i++) {
          const lineNum = i === 0 ? context.lineNumber : ++context.lineNumber
          result.nodes.push({
            type: 'text',
            value: i === lines.length - 1 ? lines[i] : `${lines[i]}\n`,
            lineStart: lineNum,
            lineEnd: lineNum,
          })
        }

        result.lineNumber = context.lineNumber
        return result
      }

      if (node.children) {
        const processed = lineNumberify(node.children, context)
        const firstChild = processed.nodes[0]
        const lastChild = processed.nodes[processed.nodes.length - 1]
        node.lineStart = firstChild ? firstChild.lineStart : lineStart
        node.lineEnd = lastChild ? lastChild.lineEnd : lineStart
        node.children = processed.nodes
        result.lineNumber = processed.lineNumber
        result.nodes.push(node)
        return result
      }

      result.nodes.push(node)
      return result
    },
    {nodes: [], lineNumber: context.lineNumber}
  )
}

function unwrapLine(markerLine, nodes) {
  const tree = {type: 'root', children: nodes}

  const headMap = new NodeMap()
  const lineMap = new NodeMap()
  const tailMap = new NodeMap()
  const cloned = []

  function addCopy(map, node, ancestors) {
    cloned.push(node)

    ancestors.forEach((ancestor) => {
      if (!map.has(ancestor)) {
        map.set(ancestor, Object.assign({}, ancestor, {children: []}))

        if (ancestor !== tree) {
          cloned.push(ancestor)
        }
      }
    })

    let i = ancestors.length
    while (i--) {
      const ancestor = map.get(ancestors[i])
      const child = ancestors[i + 1]
      const leaf = map.get(child) || node
      if (ancestor.children.indexOf(leaf) === -1) {
        ancestor.children.push(leaf)
      }
    }
  }

  visit(tree, (node, ancestors) => {
    if (node.children) {
      return
    }

    // These nodes are on previous lines, but nested within the same structure
    if (node.lineStart < markerLine) {
      addCopy(headMap, node, ancestors)
      return
    }

    // These nodes are on the target line
    if (node.lineStart === markerLine) {
      addCopy(lineMap, node, ancestors)
      return
    }

    // If we have shared ancestors with some of the cloned elements,
    // create another tree of the remaining nodes
    if (node.lineEnd > markerLine && cloned.some((clone) => ancestors.indexOf(clone) !== -1)) {
      addCopy(tailMap, node, ancestors)
    }
  })

  // Get the remaining nodes - the ones who were not part of the same tree
  const filtered = filter(tree, (node) => cloned.indexOf(node) === -1)
  const getChildren = (map) => {
    const rootNode = map.get(tree)
    if (!rootNode) {
      return []
    }

    visit(rootNode, (leaf, ancestors) => {
      if (leaf.children) {
        leaf.lineStart = 0
        leaf.lineEnd = 0
        return
      }

      ancestors.forEach((ancestor) => {
        ancestor.lineStart = Math.max(ancestor.lineStart, leaf.lineStart)
        ancestor.lineEnd = Math.max(ancestor.lineEnd, leaf.lineEnd)
      })
    })

    return rootNode.children
  }

  const merged = [].concat(
    getChildren(headMap),
    getChildren(lineMap),
    getChildren(tailMap),
    filtered ? filtered.children : []
  )

  headMap.clear()
  lineMap.clear()
  tailMap.clear()

  return merged
}

function wrapBatch(children, marker, options) {
  const className = marker.className || 'refractor-marker'
  return {
    type: 'element',
    tagName: marker.component || 'div',
    properties: marker.component ? Object.assign({}, options, {className}) : {className},
    children,
    lineStart: marker.line,
    lineEnd: children[children.length - 1].lineEnd,
    isMarker: true,
  }
}

function wrapLines(treeNodes, markers, options) {
  if (markers.length === 0 || treeNodes.length === 0) {
    return treeNodes
  }

  const ast = markers.reduce((acc, marker) => unwrapLine(marker.line, acc), treeNodes)

  // Container for the new AST
  const wrapped = []

  // Note: Markers are already sorted by line number (ascending)
  let astIndex = 0
  for (let m = 0; m < markers.length; m++) {
    const marker = markers[m]

    // Start by eating all AST nodes with line numbers up to the given marker
    for (let node = ast[astIndex]; node && node.lineEnd < marker.line; node = ast[++astIndex]) {
      wrapped.push(node)
    }

    // Now proceed to find all _contiguous_ nodes on the same line
    const batch = []
    for (let node = ast[astIndex]; node && node.lineEnd === marker.line; node = ast[++astIndex]) {
      batch.push(node)
    }

    // Now add that batch, if we have anything
    if (batch.length > 0) {
      wrapped.push(wrapBatch(batch, marker, options))
    }
  }

  // Now add the remaining AST nodes
  while (astIndex < ast.length) {
    wrapped.push(ast[astIndex++])
  }

  return wrapped
}

function addMarkers(ast, options) {
  const markers = options.markers
    .map((marker) => (marker.line ? marker : {line: marker}))
    .sort((nodeA, nodeB) => nodeA.line - nodeB.line)

  const numbered = lineNumberify(ast).nodes
  return wrapLines(numbered, markers, options)
}

module.exports = addMarkers
