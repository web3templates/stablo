"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _isEqual2 = _interopRequireDefault(require("lodash/isEqual"));

var _Document = _interopRequireDefault(require("./Document"));

var _Mutation = _interopRequireDefault(require("./Mutation"));

var _SquashingBuffer = _interopRequireDefault(require("./SquashingBuffer"));

var _debug = _interopRequireDefault(require("./debug"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ONE_MINUTE = 1000 * 60;

class Commit {
  constructor(mutations, _ref) {
    var resolve = _ref.resolve,
        reject = _ref.reject;

    _defineProperty(this, "mutations", void 0);

    _defineProperty(this, "tries", void 0);

    _defineProperty(this, "resolve", void 0);

    _defineProperty(this, "reject", void 0);

    this.mutations = mutations;
    this.tries = 0;
    this.resolve = resolve;
    this.reject = reject;
  }

  apply(doc) {
    return _Mutation.default.applyAll(doc, this.mutations);
  }

  squash(doc) {
    var result = _Mutation.default.squash(doc, this.mutations);

    result.assignRandomTransactionId();
    return result;
  }

}

var mutReducerFn = (acc, mut) => {
  acc = acc.concat(mut.mutations);
  return acc;
};

class BufferedDocument {
  // The Document we are wrapping
  // The Document with local changes applied
  // Commits that are waiting to be delivered to the server
  // Local mutations that are not scheduled to be committed yet
  constructor(doc) {
    _defineProperty(this, "mutations", void 0);

    _defineProperty(this, "document", void 0);

    _defineProperty(this, "LOCAL", void 0);

    _defineProperty(this, "commits", void 0);

    _defineProperty(this, "buffer", void 0);

    _defineProperty(this, "onMutation", void 0);

    _defineProperty(this, "onRemoteMutation", void 0);

    _defineProperty(this, "onRebase", void 0);

    _defineProperty(this, "onDelete", void 0);

    _defineProperty(this, "commitHandler", void 0);

    _defineProperty(this, "committerRunning", void 0);

    _defineProperty(this, "onConsistencyChanged", void 0);

    this.buffer = new _SquashingBuffer.default(doc);
    this.document = new _Document.default(doc);

    this.document.onMutation = msg => this.handleDocMutation(msg);

    this.document.onRemoteMutation = mut => this.onRemoteMutation && this.onRemoteMutation(mut);

    this.document.onRebase = (msg, remoteMutations, localMutations) => this.handleDocRebase(msg, remoteMutations, localMutations);

    this.document.onConsistencyChanged = msg => this.handleDocConsistencyChanged(msg);

    this.LOCAL = doc;
    this.mutations = [];
    this.commits = [];
  } // Used to reset the state of the local document model. If the model has been inconsistent
  // for too long, it has probably missed a notification, and should reload the document from the server


  reset(doc) {
    if (doc) {
      (0, _debug.default)('Document state reset to revision %s', doc._rev);
    } else {
      (0, _debug.default)('Document state reset to being deleted');
    }

    this.document.reset(doc);
    this.rebase([], []);
    this.handleDocConsistencyChanged(this.document.isConsistent());
  } // Add a change to the buffer


  add(mutation) {
    if (this.onConsistencyChanged) {
      this.onConsistencyChanged(false);
    }

    (0, _debug.default)('Staged local mutation');
    this.buffer.add(mutation);
    var oldLocal = this.LOCAL;
    this.LOCAL = mutation.apply(this.LOCAL);

    if (this.onMutation && oldLocal !== this.LOCAL) {
      (0, _debug.default)('onMutation fired');
      this.onMutation({
        mutation,
        document: this.LOCAL,
        remote: false
      });

      if (this.LOCAL === null && this.onDelete) {
        this.onDelete(this.LOCAL);
      }
    }
  } // Call when a mutation arrives from Sanity


  arrive(mutation) {
    (0, _debug.default)('Remote mutation arrived %s -> %s', mutation.previousRev, mutation.resultRev);

    if (mutation.previousRev == mutation.resultRev) {
      throw new Error("Mutation ".concat(mutation.transactionId, " has previousRev == resultRev (").concat(mutation.previousRev, ")"));
    }

    return this.document.arrive(mutation);
  } // Submit all mutations in the buffer to be committed


  commit() {
    return new Promise((resolve, reject) => {
      // Anything to commit?
      if (!this.buffer.hasChanges()) {
        resolve();
        return;
      }

      (0, _debug.default)('Committing local changes'); // Collect current staged mutations into a commit and ...

      this.commits.push(new Commit([this.buffer.purge()], {
        resolve,
        reject
      })); // ... clear the table for the next commit.

      this.buffer = new _SquashingBuffer.default(this.LOCAL);
      this.performCommits();
    });
  } // Starts the committer that will try to committ all staged commits to the database
  // by calling the commitHandler. Will keep running until all commits are successfully
  // committed.


  performCommits() {
    if (!this.commitHandler) {
      throw new Error('No commitHandler configured for this BufferedDocument');
    }

    if (this.committerRunning) {
      // We can have only one committer at any given time
      return;
    }

    this._cycleCommitter();
  } // TODO: Error handling, right now retries after every error,


  _cycleCommitter() {
    if (this.commits.length == 0) {
      this.committerRunning = false;
      return;
    }

    this.committerRunning = true;
    var commit = this.commits.shift();
    var squashed = commit.squash(this.LOCAL);
    var docResponder = this.document.stage(squashed, true);
    var responder = {
      success: () => {
        (0, _debug.default)('Commit succeeded');
        docResponder.success();
        commit.resolve(); // Keep running the committer until no more commits

        this._cycleCommitter();
      },
      failure: () => {
        (0, _debug.default)('Commit failed'); // Re stage commit

        commit.tries += 1;

        if (this.LOCAL !== null) {
          // Only schedule this commit for a retry of the document still exist to avoid looping
          // indefinitely when the document was deleted from under our noses
          this.commits.unshift(commit);
        }

        docResponder.failure(); // Todo: Need better error handling (i.e. propagate to user and provide means of retrying)

        if (commit.tries < 200) {
          setTimeout(() => this._cycleCommitter(), Math.min(commit.tries * 1000, ONE_MINUTE));
        }
      },
      cancel: error => {
        this.commits.forEach(commit => commit.reject(error)); // Throw away waiting commits

        this.commits = []; // Reset back to last known state from gradient and
        // cause a rebase that will reset the view in the
        // form

        this.reset(this.document.HEAD); // Clear the buffer of recent mutations

        this.buffer = new _SquashingBuffer.default(this.LOCAL); // Stop the committer loop

        this.committerRunning = false;
      }
    };
    (0, _debug.default)('Posting commit');
    this.commitHandler({
      mutation: squashed,
      success: responder.success,
      failure: responder.failure,
      cancel: responder.cancel
    });
  }

  handleDocRebase(msg, remoteMutations, localMutations) {
    this.rebase(remoteMutations, localMutations);
  }

  handleDocumentDeleted() {
    (0, _debug.default)('Document deleted'); // If the document was just deleted, fire the onDelete event with the absolutely latest version of the document
    // before someone deleted it so that the client may revive the document in the last state the user saw it, should
    // she so desire.

    if (this.LOCAL !== null && this.onDelete) {
      this.onDelete(this.LOCAL);
    }

    this.commits = [];
    this.mutations = [];
  }

  handleDocMutation(msg) {
    // If we have no local changes, we can just pass this on to the client
    if (this.commits.length == 0 && !this.buffer.hasChanges()) {
      (0, _debug.default)('Document mutated from remote with no local changes');
      this.LOCAL = this.document.EDGE;
      this.buffer = new _SquashingBuffer.default(this.LOCAL);

      if (this.onMutation) {
        this.onMutation(msg);
      }

      return;
    }

    (0, _debug.default)('Document mutated from remote with local changes'); // If there are local edits, and the document was deleted, we need to purge those local edits now

    if (this.document.EDGE === null) {
      this.handleDocumentDeleted();
    } // We had local changes, so need to signal rebase


    this.rebase([msg.mutation], []);
  }

  rebase(remoteMutations, localMutations) {
    (0, _debug.default)('Rebasing document');

    if (this.document.EDGE === null) {
      this.handleDocumentDeleted();
    }

    var oldLocal = this.LOCAL;
    this.LOCAL = this.commits.reduce((doc, commit) => commit.apply(doc), this.document.EDGE);
    this.LOCAL = this.buffer.rebase(this.LOCAL); // Copy over rev, since we don't care if it changed, we only care about the content

    if (oldLocal !== null && this.LOCAL !== null) {
      oldLocal._rev = this.LOCAL._rev;
    }

    var changed = !(0, _isEqual2.default)(this.LOCAL, oldLocal);

    if (changed && this.onRebase) {
      this.onRebase(this.LOCAL, remoteMutations.reduce(mutReducerFn, []), localMutations.reduce(mutReducerFn, []));
    }
  }

  handleDocConsistencyChanged(isConsistent) {
    if (!this.onConsistencyChanged) {
      return;
    }

    var hasLocalChanges = this.commits.length > 0 || this.buffer.hasChanges();

    if (isConsistent && !hasLocalChanges) {
      this.onConsistencyChanged(true);
    }

    if (!isConsistent) {
      this.onConsistencyChanged(false);
    }
  }

}

exports.default = BufferedDocument;