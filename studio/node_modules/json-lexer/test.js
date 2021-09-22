var test = require('tape')
var lexer = require('./')

test('lexer', function (t) {
  t.test('literals', function (t) {
    testCase(t, 'true', [{ type: 'literal', value: true, raw: 'true' }])
    testCase(t, 'false', [{ type: 'literal', value: false, raw: 'false' }])
    testCase(t, 'null', [{ type: 'literal', value: null, raw: 'null' }])
    t.end()
  })
  t.test('numbers', function (t) {
    testCase(t, '1', [{ type: 'number', value: 1, raw: '1' }])
    testCase(t, '1.0', [{ type: 'number', value: 1, raw: '1.0' }])
    testCase(t, '1.000', [{ type: 'number', value: 1, raw: '1.000' }])
    testCase(t, '1.5', [{ type: 'number', value: 1.5, raw: '1.5' }])
    testCase(t, '-1.5', [{ type: 'number', value: -1.5, raw: '-1.5' }])
    testCase(t, '123e5', [{ type: 'number', value: 123e5, raw: '123e5' }])
    testCase(t, '123e-5', [{ type: 'number', value: 123e-5, raw: '123e-5' }])
    t.end()
  })
  t.test('strings', function (t) {
    testCase(t, '""', [{ type: 'string', value: '', raw: '""' }])
    testCase(t, '"a"', [{ type: 'string', value: 'a', raw: '"a"' }])
    testCase(t, '"abcd"', [{ type: 'string', value: 'abcd', raw: '"abcd"' }])
    testCase(t, '"\\"\\/\\b\\t\\n\\f\\r\\\\"', [{ type: 'string', value: '"/\b\t\n\f\r\\', raw: '"\\"\\/\\b\\t\\n\\f\\r\\\\"' }])
    testCase(t, '"hi \\u0066\\u0069\\u006E\\u006E"', [{ type: 'string', value: 'hi finn', raw: '"hi \\u0066\\u0069\\u006E\\u006E"' }])
    t.end()
  })
  t.test('illegals', function (t) {
    expectError(t, '012', 'Illegal octal literal.')
    expectError(t, '2e', 'Illegal empty exponent.')
    expectError(t, '1.', 'Illegal trailing decimal.')
    expectError(t, '-', 'A negative sign may only precede numbers.')
    expectError(t, '"hi', 'Unterminated string.')
    expectError(t, '"\\x"', 'Invalid escape sequence.')
    expectError(t, '"\\u00G0"', 'Invalid Unicode escape sequence.')
    expectError(t, '"\0"', 'Unescaped ASCII control characters are not permitted.')
    expectError(t, 'undefined', 'Unrecognized token.')
    t.end()
  })
  t.test('objects', function () {
    testCase(t, '{"a":"b"}', [
      { type: 'punctuator', value: '{', raw: '{' },
      { type: 'string', value: 'a', raw: '"a"' },
      { type: 'punctuator', value: ':', raw: ':' },
      { type: 'string', value: 'b', raw: '"b"' },
      { type: 'punctuator', value: '}', raw: '}' }
    ])
    testCase(t, '\t\t\n\t{"a":  \t  "b"}', [
      { type: 'whitespace', value: '\t\t\n\t', raw: '\t\t\n\t' },
      { type: 'punctuator', value: '{', raw: '{' },
      { type: 'string', value: 'a', raw: '"a"' },
      { type: 'punctuator', value: ':', raw: ':' },
      { type: 'whitespace', value: '  \t  ', raw: '  \t  ' },
      { type: 'string', value: 'b', raw: '"b"' },
      { type: 'punctuator', value: '}', raw: '}' }
    ])
    testCase(t, '{"a" : "b"}', [
      { type: 'punctuator', value: '{', raw: '{' },
      { type: 'string', value: 'a', raw: '"a"' },
      { type: 'whitespace', value: ' ', raw: ' ' },
      { type: 'punctuator', value: ':', raw: ':' },
      { type: 'whitespace', value: ' ', raw: ' ' },
      { type: 'string', value: 'b', raw: '"b"' },
      { type: 'punctuator', value: '}', raw: '}' }
    ])
    testCase(t, '\t{"a" : "b"\n}\t', [
      { type: 'whitespace', value: '\t', raw: '\t' },
      { type: 'punctuator', value: '{', raw: '{' },
      { type: 'string', value: 'a', raw: '"a"' },
      { type: 'whitespace', value: ' ', raw: ' ' },
      { type: 'punctuator', value: ':', raw: ':' },
      { type: 'whitespace', value: ' ', raw: ' ' },
      { type: 'string', value: 'b', raw: '"b"' },
      { type: 'whitespace', value: '\n', raw: '\n' },
      { type: 'punctuator', value: '}', raw: '}' },
      { type: 'whitespace', value: '\t', raw: '\t' }
    ])
    testCase(t, '{"a":{"b":1}}', [
      { type: 'punctuator', value: '{', raw: '{' },
      { type: 'string', value: 'a', raw: '"a"' },
      { type: 'punctuator', value: ':', raw: ':' },
      { type: 'punctuator', value: '{', raw: '{' },
      { type: 'string', value: 'b', raw: '"b"' },
      { type: 'punctuator', value: ':', raw: ':' },
      { type: 'number', value: 1, raw: '1' },
      { type: 'punctuator', value: '}', raw: '}' },
      { type: 'punctuator', value: '}', raw: '}' }
    ])
    t.end()
  })
})

function attr (attribute, arr) {
  return arr.map(function (elem) {
    return elem[attribute]
  })
}

function testCase (t, json, result) {
  t.deepEqual(attr('type', lexer(json)), attr('type', result), json + ' types')
  t.deepEqual(attr('value', lexer(json)), attr('value', result), json + ' values')
  t.deepEqual(attr('raw', lexer(json)), attr('raw', result), json + ' raw')
}

function expectError (t, json, message) {
  try {
    var result = lexer(json)
  } catch (e) {
    return t.equal(e.message, 'Parsing error: ' + message, json)
  }
  t.fail('Did not throw: ' + json + ' ' + JSON.stringify(result))
}
