"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var DiffMatchPatch = _interopRequireWildcard(require("diff-match-patch"));

var _extractWithPath = _interopRequireDefault(require("../jsonpath/extractWithPath"));

var _arrayToJSONMatchPath = _interopRequireDefault(require("../jsonpath/arrayToJSONMatchPath"));

var _Mutation = _interopRequireDefault(require("./Mutation"));

var _debug = _interopRequireDefault(require("./debug"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Implements a buffer for mutations that incrementally optimises the mutations by eliminating set-operations that
// overwrite earlier set-operations, and rewrite set-operations that change strings into other strings into diffMatchPatch
// operations.
class SquashingBuffer {
  // The document forming the basis of this squash
  // The operations in the out-Mutation are not able to be optimized any further
  // The document after the out-Mutation has been applied, but before the staged operations are committed.
  // setOperations contain the latest set operation by path. If the set-operations are updating strings to new
  // strings, they are rewritten as diffMatchPatch operations, any new set operations on the same paths overwrites
  // any older set operations. Only set-operations assigning plain values to plain values gets optimized like this.
  // documentPresent is true whenever we know that the document must be present due to preceeding mutations.
  // false implies that it may or may not already exist.
  constructor(doc) {
    _defineProperty(this, "BASIS", void 0);

    _defineProperty(this, "out", []);

    _defineProperty(this, "PRESTAGE", void 0);

    _defineProperty(this, "setOperations", void 0);

    _defineProperty(this, "documentPresent", void 0);

    _defineProperty(this, "staged", void 0);

    _defineProperty(this, "dmp", void 0);

    if (doc) {
      (0, _debug.default)('Reset mutation buffer to rev %s', doc._rev);
    } else {
      (0, _debug.default)('Reset mutation buffer state to document being deleted');
    }

    this.staged = [];
    this.setOperations = {};
    this.documentPresent = false;
    this.BASIS = doc;
    this.PRESTAGE = doc;
    this.dmp = new DiffMatchPatch.diff_match_patch();
  }

  add(mut) {
    mut.mutations.forEach(op => this.addOperation(op));
  }

  hasChanges() {
    return this.out.length > 0 || Object.keys(this.setOperations).length > 0;
  } // Extracts the mutations in this buffer. After this is done, the buffer lifecycle is over and the client should
  // create an new one with the new, updated BASIS.


  purge(txnId) {
    this.stashStagedOperations();
    var result = null;

    if (this.out.length > 0) {
      (0, _debug.default)('Purged mutation buffer');
      result = new _Mutation.default({
        mutations: this.out,
        resultRev: txnId,
        transactionId: txnId
      });
    }

    this.out = [];
    this.documentPresent = false;
    return result;
  }

  addOperation(op) {
    // Is this a set patch, and only a set patch, and does it apply to the document at hand?
    if (op.patch && op.patch.set && op.patch.id === this.PRESTAGE._id && Object.keys(op.patch).length == 2) {
      // console.log("Attempting to apply optimised set patch")
      var setPatch = op.patch.set;
      var unoptimizable = {}; // Apply all optimisable keys in the patch

      for (var _i = 0, _Object$keys = Object.keys(setPatch); _i < _Object$keys.length; _i++) {
        var path = _Object$keys[_i];

        // console.log("...", path)
        if (setPatch.hasOwnProperty(path)) {
          if (!this.optimiseSetOperation(path, setPatch[path])) {
            // If not optimisable, add to unoptimizable set
            unoptimizable[path] = setPatch[path];
          }
        }
      } // If any weren't optimisable, add them to an unoptimised set-operation, then
      // stash everything.


      if (Object.keys(unoptimizable).length > 0) {
        (0, _debug.default)('Unoptimizable set-operation detected, purging optimization buffer');
        this.staged.push({
          patch: {
            id: this.PRESTAGE._id,
            set: unoptimizable
          }
        });
        this.stashStagedOperations();
      }

      return;
    } // Is this a createIfNotExists for our document?


    if (op.createIfNotExists && this.PRESTAGE && op.createIfNotExists._id === this.PRESTAGE._id) {
      if (!this.documentPresent) {
        // If we don't know that it's present we'll have to stage and stash.
        this.staged.push(op);
        this.documentPresent = true;
        this.stashStagedOperations();
      } // Otherwise we can fully ignore it.


      return;
    }

    (0, _debug.default)('Unoptimizable mutation detected, purging optimization buffer'); // console.log("Unoptimizable operation, stashing", JSON.stringify(op))
    // Un-optimisable operations causes everything to be stashed

    this.staged.push(op);
    this.stashStagedOperations();
  } // Attempt to perform one single set operation in an optimised manner, return value reflects whether the
  // operation could be performed.


  optimiseSetOperation(path, nextValue) {
    // console.log('optimiseSetOperation', path, nextValue)
    // If target value is not a plain value, unable to optimise
    if (typeof nextValue === 'object') {
      // console.log("Not optimisable because next value is object")
      return false;
    } // Check the source values, if there is more than one value being assigned,
    // we won't optimise


    var matches = (0, _extractWithPath.default)(path, this.PRESTAGE); // If we are not overwriting exactly one key, this cannot be optimised, so we bail

    if (matches.length !== 1) {
      // console.log('Not optimisable because match count is != 1', JSON.stringify(matches))
      return false;
    } // Okay, we are assigning exactly one value to exactly one existing slot, so we might optimise


    var match = matches[0]; // If the value of the match is an array or object, we cannot safely optimise this since the meaning
    // of pre-existing operations might change (in theory, at least), so we bail

    if (typeof match.value === 'object') {
      // console.log("Not optimisable because old value is object")
      return false;
    } // If the new and old value are the equal, we optimise this operation by discarding it
    // Now, let's build the operation


    var op;

    if (match.value === nextValue) {
      // If new and old values are equal, we optimise this by deleting the operation
      // console.log("Omitting operation")
      op = null;
    } else if (typeof match.value === 'string' && typeof nextValue === 'string') {
      // console.log("Rewriting to dmp")
      // We are updating a string to another string, so we are making a diffMatchPatch
      try {
        var patch = this.dmp.patch_make(match.value, nextValue).map(patch => patch.toString()).join('');
        op = {
          patch: {
            id: this.PRESTAGE._id,
            diffMatchPatch: {
              [path]: patch
            }
          }
        };
      } catch (_unused) {
        // patch_make failed due to unicode issue https://github.com/google/diff-match-patch/issues/59
        return false;
      }
    } else {
      // console.log("Not able to rewrite to dmp, making normal set")
      // We are changing the type of the value, so must make a normal set-operation
      op = {
        patch: {
          id: this.PRESTAGE._id,
          set: {
            [path]: nextValue
          }
        }
      };
    } // Let's make a plain, concrete path from the array-path. We use this to keep only the latest set
    // operation touching this path in the buffer.


    var canonicalPath = (0, _arrayToJSONMatchPath.default)(match.path); // Store this operation, overwriting any previous operations touching this same path

    if (op) {
      this.setOperations[canonicalPath] = op;
    } else {
      delete this.setOperations[canonicalPath];
    } // Signal that we succeeded in optimizing this patch


    return true;
  }

  stashStagedOperations() {
    // console.log('stashStagedOperations')
    // Short circuit if there are no staged operations
    var nextOps = []; // Extract the existing outgoing operations if any

    Object.keys(this.setOperations).forEach(key => {
      nextOps.push(this.setOperations[key]);
    });
    nextOps.push(...this.staged);

    if (nextOps.length > 0) {
      this.PRESTAGE = new _Mutation.default({
        mutations: nextOps
      }).apply(this.PRESTAGE);
      this.staged = [];
      this.setOperations = {};
    }

    this.out.push(...nextOps);
  } // Rebases given the new base-document. Returns the new "edge" document with the buffered changes
  // integrated.


  rebase(newBasis) {
    this.stashStagedOperations();

    if (newBasis === null) {
      // If document was just deleted, we must throw out local changes
      this.out = [];
      this.PRESTAGE = this.BASIS = newBasis;
      this.documentPresent = false;
    } else {
      this.BASIS = newBasis;

      if (this.out) {
        this.PRESTAGE = new _Mutation.default({
          mutations: this.out
        }).apply(this.BASIS);
      } else {
        this.PRESTAGE = this.BASIS;
      }
    }

    return this.PRESTAGE;
  }

}

exports.default = SquashingBuffer;