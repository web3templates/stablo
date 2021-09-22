"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = tokenize;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Tokenizes a jsonpath2 expression
// TODO: Support '*'
var digitChar = /[0-9]/;
var attributeCharMatcher = /^[a-zA-Z0-9_]$/;
var attributeFirstCharMatcher = /^[a-zA-Z_]$/;
var symbols = {
  operator: ['..', '.', ',', ':', '?'],
  comparator: ['>', '>=', '<', '<=', '==', '!='],
  keyword: ['$', '@'],
  boolean: ['true', 'false'],
  paren: ['[', ']']
};

class Tokenizer {
  constructor(path) {
    _defineProperty(this, "source", void 0);

    _defineProperty(this, "i", void 0);

    _defineProperty(this, "start", void 0);

    _defineProperty(this, "length", void 0);

    _defineProperty(this, "tokenizers", void 0);

    this.source = path;
    this.length = path.length;
    this.i = 0;
    this.tokenizers = [this.tokenizeSymbol, this.tokenizeIdentifier, this.tokenizeNumber, this.tokenizeQuoted].map(fn => fn.bind(this));
  }

  tokenize() {
    var _this = this;

    var result = [];

    var _loop = function _loop() {
      var token = void 0;

      _this.chompWhitespace();

      var found = _this.tokenizers.find(tokenizer => {
        token = tokenizer();
        return !!token;
      });

      if (!found) {
        throw new Error("Invalid tokens in jsonpath '".concat(_this.source, "' @ ").concat(_this.i));
      }

      result.push(token);
    };

    while (!this.EOF()) {
      _loop();
    }

    return result;
  }

  takeWhile(fn) {
    var start = this.i;
    var result = '';

    while (!this.EOF()) {
      var nextChar = fn(this.source[this.i]);

      if (nextChar === null) {
        break;
      }

      result += nextChar;
      this.i++;
    }

    if (this.i === start) {
      return null;
    }

    return result;
  }

  EOF() {
    return this.i >= this.length;
  }

  peek() {
    if (this.EOF()) {
      return null;
    }

    return this.source[this.i];
  }

  consume(str) {
    if (this.i + str.length > this.length) {
      throw new Error("Expected ".concat(str, " at end of jsonpath"));
    }

    if (str == this.source.slice(this.i, this.i + str.length)) {
      this.i += str.length;
    } else {
      throw new Error("Expected \"".concat(str, "\", but source contained \"").concat(this.source.slice(this.start)));
    }
  } // Tries to match the upcoming bit of string with the provided string. If it matches, returns
  // the string, then advances the read pointer to the next bit. If not, returns null and nothing
  // happens.


  tryConsume(str) {
    if (this.i + str.length > this.length) {
      return null;
    }

    if (str == this.source.slice(this.i, this.i + str.length)) {
      this.i += str.length;
      return str;
    }

    return null;
  }

  chompWhitespace() {
    this.takeWhile(char => {
      return char == ' ' ? '' : null;
    });
  }

  tokenizeQuoted() {
    var quote = this.peek();

    if (quote == "'" || quote == '"') {
      this.consume(quote);
      var _escape = false;
      var inner = this.takeWhile(char => {
        if (_escape) {
          _escape = false;
          return char;
        }

        if (char == '\\') {
          _escape = true;
          return '';
        }

        if (char != quote) {
          return char;
        }

        return null;
      });
      this.consume(quote);
      return {
        type: 'quoted',
        value: inner,
        quote: quote == '"' ? 'double' : 'single'
      };
    }

    return null;
  }

  tokenizeIdentifier() {
    var first = true;
    var identifier = this.takeWhile(char => {
      if (first) {
        first = false;
        return char.match(attributeFirstCharMatcher) ? char : null;
      }

      return char.match(attributeCharMatcher) ? char : null;
    });

    if (identifier !== null) {
      return {
        type: 'identifier',
        name: identifier
      };
    }

    return null;
  }

  tokenizeNumber() {
    var start = this.i;
    var dotSeen = false;
    var digitSeen = false;
    var negative = false;

    if (this.peek() == '-') {
      negative = true;
      this.consume('-');
    }

    var number = this.takeWhile(char => {
      if (char == '.' && !dotSeen && digitSeen) {
        dotSeen = true;
        return char;
      }

      digitSeen = true;
      return char.match(digitChar) ? char : null;
    });

    if (number !== null) {
      return {
        type: 'number',
        value: negative ? -number : +number,
        raw: negative ? "-".concat(number) : number
      };
    } // No number, rewind


    this.i = start;
    return null;
  }

  tokenizeSymbol() {
    var result = null;
    Object.keys(symbols).find(symbolClass => {
      var patterns = symbols[symbolClass];
      var found = patterns.find(pattern => this.tryConsume(pattern));

      if (found) {
        result = {
          type: symbolClass,
          symbol: found
        };
        return true;
      }

      return false;
    });
    return result;
  }

}

function tokenize(jsonpath) {
  return new Tokenizer(jsonpath).tokenize();
}