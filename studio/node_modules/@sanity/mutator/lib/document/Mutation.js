"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _patch = require("../patch");

var _luid = _interopRequireDefault(require("./luid"));

var _debug = _interopRequireDefault(require("./debug"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// change its behavior after that.
class Mutation {
  constructor(options) {
    _defineProperty(this, "params", void 0);

    _defineProperty(this, "compiled", void 0);

    _defineProperty(this, "_appliesToMissingDocument", void 0);

    this.params = options;
  }

  get transactionId() {
    return this.params.transactionId;
  }

  get transition() {
    return this.params.transition;
  }

  get identity() {
    return this.params.identity;
  }

  get previousRev() {
    return this.params.previousRev;
  }

  get resultRev() {
    return this.params.resultRev;
  }

  get mutations() {
    return this.params.mutations;
  }

  get timestamp() {
    if (typeof this.params.timestamp == 'string') {
      return new Date(this.params.timestamp);
    }

    return undefined;
  }

  get effects() {
    return this.params.effects;
  }

  assignRandomTransactionId() {
    this.params.resultRev = this.params.transactionId = (0, _luid.default)();
  }

  appliesToMissingDocument() {
    if (typeof this._appliesToMissingDocument !== 'undefined') {
      return this._appliesToMissingDocument;
    } // Only mutations starting with a create operation apply to documents that do not exist ...


    var firstMut = this.mutations[0];

    if (firstMut) {
      this._appliesToMissingDocument = firstMut.create || firstMut.createIfNotExists || firstMut.createOrReplace;
    } else {
      this._appliesToMissingDocument = true;
    }

    return this._appliesToMissingDocument;
  } // Compiles all mutations into a handy function


  compile() {
    var operations = [];
    this.mutations.forEach(mutation => {
      if (mutation.create) {
        // TODO: Fail entire patch if document did exist
        operations.push(doc => doc === null ? Object.assign(mutation.create, {
          _createdAt: mutation.create._createdAt || this.params.timestamp
        }) : doc);
      } else if (mutation.createIfNotExists) {
        operations.push(doc => doc === null ? Object.assign(mutation.createIfNotExists, {
          _createdAt: mutation.createIfNotExists._createdAt || this.params.timestamp
        }) : doc);
      } else if (mutation.createOrReplace) {
        operations.push(() => Object.assign(mutation.createOrReplace, {
          _createdAt: mutation.createOrReplace._createdAt || this.params.timestamp
        }));
      } else if (mutation.delete) {
        operations.push(() => null);
      } else if (mutation.patch) {
        var patch = new _patch.Patcher(mutation.patch);
        operations.push(doc => patch.apply(doc));
      } else {
        throw new Error("Unsupported mutation ".concat(JSON.stringify(mutation, null, 2)));
      }
    });

    if (typeof this.params.timestamp === 'string') {
      operations.push(doc => {
        if (doc) {
          return Object.assign(doc, {
            _updatedAt: this.params.timestamp
          });
        }

        return doc;
      });
    }

    var prevRev = this.previousRev;
    var rev = this.resultRev || this.transactionId;

    this.compiled = doc => {
      if (prevRev && prevRev != doc._rev) {
        throw new Error("Previous revision for this mutation was ".concat(prevRev, ", but the document revision is ").concat(doc._rev));
      }

      var result = operations.reduce((revision, operation) => operation(revision), doc); // Should update _rev?

      if (result && rev) {
        // Ensure that result is a unique object, even if the operation was a no-op
        if (result === doc) {
          result = Object.assign({}, doc);
        }

        result._rev = rev;
      }

      return result;
    };
  }

  apply(document) {
    (0, _debug.default)('Applying mutation %O to document %O', this.mutations, document);

    if (!this.compiled) {
      this.compile();
    }

    var result = this.compiled(document);
    (0, _debug.default)('  => %O', result);
    return result;
  }

  static applyAll(document, mutations) {
    return mutations.reduce((doc, mutation) => mutation.apply(doc), document);
  } // Given a number of yet-to-be-committed mutation objects, collects them into one big mutation
  // any metadata like transactionId is ignored and must be submitted by the client. It is assumed
  // that all mutations are on the same document.
  // TOOO: Optimize mutations, eliminating mutations that overwrite themselves!


  static squash(document, mutations) {
    var squashed = mutations.reduce((result, mutation) => result.concat(...mutation.mutations), []);
    return new Mutation({
      mutations: squashed
    });
  }

}

exports.default = Mutation;