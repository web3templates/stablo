module.exports = (strings, ...keys) =>
 strings
    .reduce((result, part, i) => result + part + (keys[i] || '') , '')
    .replace(/(?:\n(?:\s*))+/g, ' ')
    .trim()
