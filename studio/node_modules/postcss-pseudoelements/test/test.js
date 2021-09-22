var should = require('should');
var postcss = require('postcss');
var fs = require('fs');
var pseudoelements = require('../index.js')

describe('test', function() {

  it('should default to one colon per pseudo element', function() {
    var input = fs.readFileSync('./test/input.css', 'utf-8');
    var expected = fs.readFileSync('./test/expected-single.css', 'utf-8');

    var out = postcss(pseudoelements()).process(input);

    out.css.should.equal(expected, 'test failed')
  });

  it('should default to two colons per pseudo element', function() {
    var input = fs.readFileSync('./test/input.css', 'utf-8');
    var expected = fs.readFileSync('./test/expected-double.css', 'utf-8');
    var options = {
      single: false,
    }

    var out = postcss(pseudoelements(options)).process(input);

    out.css.should.equal(expected, 'test failed')
  });
});
