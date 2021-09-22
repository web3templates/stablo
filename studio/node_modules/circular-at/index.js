module.exports = function circularAt (array, index) {
  var length = array && array.length
  var idx = Math.abs(length + index % length) % length
  return array[isNaN(idx) ? index : idx]
}
