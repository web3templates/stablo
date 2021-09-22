"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parse;

var _tokenize = _interopRequireDefault(require("./tokenize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// TODO: Support '*'
class Parser {
  constructor(path) {
    _defineProperty(this, "tokens", void 0);

    _defineProperty(this, "length", void 0);

    _defineProperty(this, "i", void 0);

    this.tokens = (0, _tokenize.default)(path);
    this.length = this.tokens.length;
    this.i = 0;
  }

  parse() {
    return this.parsePath();
  }

  EOF() {
    return this.i >= this.length;
  } // Look at upcoming token


  peek() {
    if (this.EOF()) {
      return null;
    }

    return this.tokens[this.i];
  }

  consume() {
    var result = this.peek(); // console.log("consumed", result)

    this.i += 1;
    return result;
  } // Return next token if it matches the pattern


  probe(pattern) {
    var token = this.peek(); // console.log("Probing", token, "for", pattern)

    if (!token) {
      // console.log(" -> nay", token)
      return null;
    }

    var mismatch = Object.keys(pattern).find(key => {
      var value = pattern[key];

      if (!token[key] || token[key] != value) {
        // console.log(" -> nay", key)
        return true;
      }

      return false;
    });

    if (mismatch) {
      return null;
    } // console.log(" -> yay", token)


    return token;
  } // Return and consume next token if it matches the pattern


  match(pattern) {
    if (this.probe(pattern)) {
      return this.consume();
    }

    return null;
  }

  parseAttribute() {
    var token = this.match({
      type: 'identifier'
    });

    if (token) {
      return {
        type: 'attribute',
        name: token.name
      };
    }

    var quoted = this.match({
      type: 'quoted',
      quote: 'single'
    });

    if (quoted) {
      return {
        type: 'attribute',
        name: quoted.value
      };
    }

    return null;
  }

  parseAlias() {
    if (this.match({
      type: 'keyword',
      symbol: '@'
    }) || this.match({
      type: 'keyword',
      symbol: '$'
    })) {
      return {
        type: 'alias',
        target: 'self'
      };
    }

    return null;
  }

  parseNumber() {
    var token = this.match({
      type: 'number'
    });

    if (token) {
      return {
        type: 'number',
        value: token.value
      };
    }

    return null;
  }

  parseNumberValue() {
    var expr = this.parseNumber();

    if (expr) {
      return expr.value;
    }

    return null;
  }

  parseSliceSelector() {
    var start = this.i;
    var result = {
      type: 'range'
    };
    result.start = this.parseNumberValue();
    var colon1 = this.match({
      type: 'operator',
      symbol: ':'
    });

    if (colon1) {
      result.end = this.parseNumberValue();
      var colon2 = this.match({
        type: 'operator',
        symbol: ':'
      });

      if (colon2) {
        result.step = this.parseNumberValue();
      }
    } else {
      if (result.start !== null) {
        // Unwrap, this was just a single index not followed by colon
        return {
          type: 'index',
          value: result.start
        };
      } // Rewind, this was actually nothing


      this.i = start;
      return null;
    }

    if (result.start === null && result.end === null) {
      // rewind, this wasnt' a slice selector
      this.i = start; // console.log("Mising start and end of slice, rewinding")

      return null;
    }

    return result;
  }

  parseValueReference() {
    return this.parseAttribute() || this.parseSliceSelector();
  }

  parseLiteralValue() {
    var literalString = this.match({
      type: 'quoted',
      quote: 'double'
    });

    if (literalString) {
      return {
        type: 'string',
        value: literalString.value
      };
    }

    var literalBoolean = this.match({
      type: 'boolean'
    });

    if (literalBoolean) {
      return {
        type: 'boolean',
        value: literalBoolean.symbol == 'true'
      };
    }

    return this.parseNumber();
  } // TODO: Reorder constraints so that literal value is always on rhs, and variable is always
  // on lhs.


  parseFilterExpression() {
    var start = this.i;
    var expr = this.parseAttribute() || this.parseAlias();

    if (!expr) {
      return null;
    }

    if (this.match({
      type: 'operator',
      symbol: '?'
    })) {
      return {
        type: 'constraint',
        operator: '?',
        lhs: expr
      };
    }

    var binOp = this.match({
      type: 'comparator'
    });

    if (!binOp) {
      // No expression, rewind!
      this.i = start;
      return null;
    }

    var lhs = expr;
    var rhs = this.parseLiteralValue();

    if (!rhs) {
      throw new Error("Operator ".concat(binOp.symbol, " needs a literal value at the right hand side"));
    }

    return {
      type: 'constraint',
      operator: binOp.symbol,
      lhs: lhs,
      rhs: rhs
    };
  }

  parseExpression() {
    return this.parseFilterExpression() || this.parseValueReference();
  }

  parseUnion() {
    if (!this.match({
      type: 'paren',
      symbol: '['
    })) {
      return null;
    }

    var terms = [];
    var expr = this.parseFilterExpression() || this.parsePath() || this.parseValueReference();

    while (expr) {
      terms.push(expr); // End of union?

      if (this.match({
        type: 'paren',
        symbol: ']'
      })) {
        break;
      }

      if (!this.match({
        type: 'operator',
        symbol: ','
      })) {
        throw new Error('Expected ]');
      }

      expr = this.parseFilterExpression() || this.parsePath() || this.parseValueReference();

      if (!expr) {
        throw new Error("Expected expression following ','");
      }
    } // console.log("Union terms", terms)
    // return unionFromTerms(terms)


    return {
      type: 'union',
      nodes: terms
    };
  }

  parseRecursive() {
    if (this.match({
      type: 'operator',
      symbol: '..'
    })) {
      var subpath = this.parsePath();

      if (!subpath) {
        throw new Error("Expected path following '..' operator");
      }

      return {
        type: 'recursive',
        term: subpath
      };
    }

    return null;
  }

  parsePath() {
    var nodes = [];
    var expr = this.parseAttribute() || this.parseUnion() || this.parseRecursive();

    if (!expr) {
      return null;
    }

    nodes.push(expr);

    while (!this.EOF()) {
      if (this.match({
        type: 'operator',
        symbol: '.'
      })) {
        var attr = this.parseAttribute();

        if (!attr) {
          throw new Error("Expected attribute name following '.");
        }

        nodes.push(attr);
        continue;
      } else if (this.probe({
        type: 'paren',
        symbol: '['
      })) {
        var union = this.parseUnion();

        if (!union) {
          throw new Error("Expected union following '['");
        }

        nodes.push(union);
      } else {
        var recursive = this.parseRecursive();

        if (recursive) {
          nodes.push(recursive);
        }

        break;
      }
    }

    if (nodes.length == 1) {
      return nodes[0];
    }

    return {
      type: 'path',
      nodes: nodes
    };
  }

}

function parse(path) {
  return new Parser(path).parse();
} // Todo: find out if these has any value (currently not in used)
// function unionFromTerms(terms): any {
//   let result: any = {
//     type: 'union'
//   }
//   terms.forEach(term => {
//     switch (term.type) {
//       case 'index':
//         result.indexes = (result.indexes || []).concat(term.value)
//         break
//       case 'range':
//         result.ranges = (result.ranges || []).concat(term)
//         break
//       case 'path':
//         result.paths = (result.paths || []).concat(term)
//         break
//       case 'constraint':
//         result.constraints = (result.constraints || []).concat(term)
//         break
//       case 'union':
//         result = mergeUnions(result, term)
//         break
//       default:
//         throw new Error(`Unexpected union member of type ${term.type}`)
//     }
//   })
//   if (result.indexes) {
//     result.indexes = uniq(result.indexes)
//   }
//   return result
// }
// function mergeUnions(union1, union2): Object {
//   const result = {
//     type: 'union'
//   }
//   uniq(Object.keys(union1).concat(Object.keys(union2))).forEach(key => {
//     result[key] = (union1[key] || []).concat(union2[key] || [])
//   })
//   return result
// }