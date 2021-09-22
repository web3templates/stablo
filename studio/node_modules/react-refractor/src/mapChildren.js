const React = require('react')

function mapChild(child, i, depth) {
  if (child.tagName) {
    const className =
      child.properties && Array.isArray(child.properties.className)
        ? child.properties.className.join(' ')
        : child.properties.className

    return React.createElement(
      child.tagName,
      Object.assign({key: `fract-${depth}-${i}`}, child.properties, {className}),
      child.children && child.children.map(mapWithDepth(depth + 1))
    )
  }

  return child.value
}

function mapWithDepth(depth) {
  return function mapChildrenWithDepth(child, i) {
    return mapChild(child, i, depth)
  }
}

exports.depth = mapWithDepth
