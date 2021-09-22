function abort (message) {
  var text = 'Parsing error'
  if (message) text += ': ' + message
  throw new Error(text)
}

var unescapes = {
  '\\': '\\',
  '"': '"',
  '/': '/',
  'b': '\b',
  't': '\t',
  'n': '\n',
  'f': '\f',
  'r': '\r'
}

function lex (source) {
  var result = []
  var index = 0
  var token = lexStep()
  while (token) {
    result.push(token)
    token = lexStep()
  }
  return result

  function lexStep () {
    var length = source.length
    var value
    var begin
    var position
    var isSigned
    var charCode
    var character
    while (index < length) {
      character = source[index]
      switch (character) {
        case '\t':
        case '\n':
        case '\r':
        case ' ':
          // returns white spaces characters
          value = source[index]
          while ('\t\n\r '.indexOf(source[++index]) !== -1) {
            value += source[index]
          }
          return {type: 'whitespace', value: value, raw: value}
        case '{':
        case '}':
        case '[':
        case ']':
        case ':':
        case ',':
          // Parse a punctuator token (`{`, `}`, `[`, `]`, `:`, or `,`) at
          // the current position.
          var punctuator = source[index++]
          return {type: 'punctuator', value: punctuator, raw: punctuator}
        case '"':
          // `"` delimits a JSON string; advance to the next character and
          // begin parsing the string. String tokens are prefixed with the
          // sentinel `@` character to distinguish them from punctuators and
          // end-of-string tokens.
          var stringStartIndex = index
          for (value = '', index++; index < length;) {
            character = source[index]
            if (source.charCodeAt(index) < 32) {
              return abort('Unescaped ASCII control characters are not permitted.')
            } else if (character === '\\') {
              // A reverse solidus (`\`) marks the beginning of an escaped
              // control character (including `"`, `\`, and `/`) or Unicode
              // escape sequence.
              character = source[++index]
              switch (character) {
                case '\\':
                case '"':
                case '/':
                case 'b':
                case 't':
                case 'n':
                case 'f':
                case 'r':
                  // Revive escaped control characters.
                  value += unescapes[character]
                  index++
                  break
                case 'u':
                  // `\u` marks the beginning of a Unicode escape sequence.
                  // Advance to the first character and validate the
                  // four-digit code point.
                  begin = ++index
                  for (position = index + 4; index < position; index++) {
                    charCode = source.charCodeAt(index)
                    // A valid sequence comprises four hexdigits (case-
                    // insensitive) that form a single hexadecimal value.
                    if (!(charCode >= 48 && charCode <= 57 || charCode >= 97 && charCode <= 102 || charCode >= 65 && charCode <= 70)) {
                      return abort('Invalid Unicode escape sequence.')
                    }
                  }
                  // Revive the escaped character.
                  value += String.fromCharCode('0x' + source.slice(begin, index))
                  break
                default:
                  return abort('Invalid escape sequence.')
              }
            } else {
              if (character === '"') {
                // An unescaped double-quote character marks the end of the
                // string.
                break
              }
              character = source[index]
              begin = index
              // Optimize for the common case where a string is valid.
              charCode = source.charCodeAt(index)
              while (charCode >= 32 && charCode !== 92 && charCode !== 34) {
                charCode = source.charCodeAt(++index)
              }
              // Append the string as-is.
              value += source.slice(begin, index)
            }
          }
          if (source[index] === '"') {
            // Advance to the next character and return the revived string.
            index++
            var rawString = source.slice(stringStartIndex, index)
            return { type: 'string', value: value, raw: rawString }
          }
          return abort('Unterminated string.')
        default:
          // Parse numbers and literals.
          begin = index
          // Advance past the negative sign, if one is specified.
          if (character === '-') {
            isSigned = true
            charCode = source.charCodeAt(++index)
            character = source[index]
          }
          // Parse an integer or floating-point value.
          charCode = source.charCodeAt(index)
          if (charCode >= 48 && charCode <= 57) {
            // Leading zeroes are interpreted as octal literals.
            if (charCode === 48 && ((charCode = source.charCodeAt(index + 1)), charCode >= 48 && charCode <= 57)) {
              return abort('Illegal octal literal.')
            }
            isSigned = false
            // Parse the integer component.
            for (; index < length && ((charCode = source.charCodeAt(index)), charCode >= 48 && charCode <= 57); index++);
              // Floats cannot contain a leading decimal point; however, this
              // case is already accounted for by the parser.
            if (source.charCodeAt(index) === 46) {
              position = ++index
              // Parse the decimal component.
              for (; position < length && ((charCode = source.charCodeAt(position)), charCode >= 48 && charCode <= 57); position++);
              if (position === index) {
                return abort('Illegal trailing decimal.')
              }
              index = position
            }
            // Parse exponents. The `e` denoting the exponent is
            // case-insensitive.
            charCode = source.charCodeAt(index)
            if (charCode === 101 || charCode === 69) {
              charCode = source.charCodeAt(++index)
              // Skip past the sign following the exponent, if one is
              // specified.
              if (charCode === 43 || charCode === 45) {
                index++
              }
              // Parse the exponential component.
              for (position = index; position < length && ((charCode = source.charCodeAt(position)), charCode >= 48 && charCode <= 57); position++) ;
              if (position === index) {
                return abort('Illegal empty exponent.')
              }
              index = position
            }
            // Coerce the parsed value to a JavaScript number.
            var numberString = source.slice(begin, index)
            return {type: 'number', value: +numberString, raw: numberString}
          }
          if (isSigned) {
            return abort('A negative sign may only precede numbers.')
          }
          // `true`, `false`, and `null` literals.
          var temp = source.slice(index, index + 4)
          if (temp === 'true') {
            index += 4
            return {type: 'literal', value: true, raw: 'true'}
          } else if (temp === 'fals' && source[index + 4] === 'e') {
            index += 5
            return {type: 'literal', value: false, raw: 'false'}
          } else if (temp === 'null') {
            index += 4
            return {type: 'literal', value: null, raw: 'null'}
          }
          return abort('Unrecognized token.')
      }
    }
    return false
  }
}

module.exports = lex
