
/**
 * Module dependencies.
 */

var ExifReader = require('./js/ExifReader').ExifReader;

/**
 * Parse EXIF tags in `buf`.
 *
 * @param {ArrayBuffer} buf
 * @return {Object}
 * @api public
 */

module.exports = function(buf){
  var exif = new ExifReader;
  exif.load(buf);
  var tags = exif.getAllTags();
  var out = {};

  for(var tag in tags) {
    out[spaces(tag)] = tags[tag].description;
  }

  return out;
};

/**
 * Convert camel-case to lowercase words
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

function spaces(str) {
  return str.replace(/([A-Z][a-z])|([a-z][A-Z])|([A-Z])/g, function(m) {
    return (1 == m.length)
      ? m.toLowerCase()
      : (m[0] == m[0].toUpperCase()) ? ' ' + m.toLowerCase() : m[0] + ' ' + m[1].toLowerCase()
  }).replace(/^\s+|\s+$/g, '');
}
