'use strict'

module.exports = function humanizeList (list, options) {
  if (!Array.isArray(list)) {
    throw new TypeError('humanize-list expected an array')
  }

  options = options || {}
  options.conjunction = options.conjunction || 'and'

  var listLength = list.length

  if (listLength === 1) {
    return list[0]
  }

  if (options.skipConjunction) {
    return list.join(', ')
  }

  var humanizedList = ''
  for (var i = 0; i < listLength; i++) {
    if (i === listLength - 1) {
      if (options.oxfordComma) {
        humanizedList += ','
      }

      humanizedList += ' ' + options.conjunction + ' '
    } else if (i !== 0) {
      humanizedList += ', '
    }

    humanizedList += list[i]
  }

  return humanizedList
}
