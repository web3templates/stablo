module.exports = shallow

function shallow(a, b, compare) {
  var aIsNull = a === null
  var bIsNull = b === null

  if (aIsNull !== bIsNull) return false

  var aIsArray = Array.isArray(a)
  var bIsArray = Array.isArray(b)

  if (aIsArray !== bIsArray) return false

  var aTypeof = typeof a
  var bTypeof = typeof b

  if (aTypeof !== bTypeof) return false
  if (flat(aTypeof)) return compare
    ? compare(a, b)
    : a === b

  return aIsArray
    ? shallowArray(a, b, compare)
    : shallowObject(a, b, compare)
}

function shallowArray(a, b, compare) {
  var l = a.length
  if (l !== b.length) return false

  if (compare) {
    for (var i = 0; i < l; i++)
      if (!compare(a[i], b[i])) return false
  } else {
    for (var i = 0; i < l; i++) {
      if (a[i] !== b[i]) return false
    }
  }

  return true
}

function shallowObject(a, b, compare) {
  var ka = 0
  var kb = 0

  if (compare) {
    for (var key in a) {
      if (
        a.hasOwnProperty(key) &&
        !compare(a[key], b[key])
      ) return false

      ka++
    }
  } else {
    for (var key in a) {
      if (
        a.hasOwnProperty(key) &&
        a[key] !== b[key]
      ) return false

      ka++
    }
  }

  for (var key in b) {
    if (b.hasOwnProperty(key)) kb++
  }

  return ka === kb
}

function flat(type) {
  return (
    type !== 'function' &&
    type !== 'object'
  )
}
