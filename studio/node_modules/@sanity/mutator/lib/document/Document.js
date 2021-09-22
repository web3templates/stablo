"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _isEqual2 = _interopRequireDefault(require("lodash/isEqual"));

var _Mutation = _interopRequireDefault(require("./Mutation"));

var _debug = _interopRequireDefault(require("./debug"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Document {
  // Incoming patches from the server waiting to be applied to HEAD
  // Patches we know has been subitted to the server, but has not been seen yet in the return channel
  // so we can't be sure about the ordering yet (someone else might have slipped something between them)
  // Our model of the document according to the incoming patches from the server
  // Our optimistic model of what the document will probably look like as soon as all our patches have been
  // processed. Updated every time we stage a new mutation, but also might revert back to previous states
  // if our mutations fail, or could change if unexpected mutations arrive between our own. The onRebase
  // callback will be called when EDGE changes in this manner.
  // Called with the EDGE document when that document changes for a reason other than us staging a new patch
  // or receiving a mutation from the server while our EDGE is in sync with HEAD: I.e. when EDGE changes because
  // the order of mutations has changed in relation to our optimistic predictions.
  // Called when we receive a patch in the normal order of things, but the mutation is not ours
  // Called when consistency state changes with the boolean value of the current consistency state
  // Called whenever a new incoming mutation comes in. These are always ordered correctly.
  // We are consistent when there are no unresolved mutations of our own, and no un-applicable incoming mutations.
  // When this has been going on for too long, and there has been a while since we staged a new mutation,
  //  it is time to reset your state.
  // The last time we staged a patch of our own. If we have been inconsistent for a while, but it hasn't been long since
  // we staged a new mutation, the reason is probably just because the user is typing or something. Should be used as
  // a guard agains resetting state for inconsistensy reasons.
  constructor(doc) {
    _defineProperty(this, "incoming", void 0);

    _defineProperty(this, "submitted", void 0);

    _defineProperty(this, "pending", void 0);

    _defineProperty(this, "HEAD", void 0);

    _defineProperty(this, "EDGE", void 0);

    _defineProperty(this, "onRebase", void 0);

    _defineProperty(this, "onMutation", void 0);

    _defineProperty(this, "onConsistencyChanged", void 0);

    _defineProperty(this, "onRemoteMutation", void 0);

    _defineProperty(this, "inconsistentAt", void 0);

    _defineProperty(this, "lastStagedAt", void 0);

    this.reset(doc);
  } // Reset the state of the Document, used to recover from unsavory states by reloading the document


  reset(doc) {
    this.incoming = [];
    this.submitted = [];
    this.pending = [];
    this.inconsistentAt = null;
    this.HEAD = doc;
    this.EDGE = doc;
    this.considerIncoming();
    this.updateConsistencyFlag();
  } // Call when a mutation arrives from Sanity


  arrive(mutation) {
    this.incoming.push(mutation);
    this.considerIncoming();
    this.updateConsistencyFlag();
  } // Call to signal that we are submitting a mutation. Returns a callback object with a
  // success and failure handler that must be called according to the outcome of our
  // submission.


  stage(mutation, silent) {
    if (!mutation.transactionId) {
      throw new Error('Mutations _must_ have transactionId when submitted');
    }

    this.lastStagedAt = new Date();
    (0, _debug.default)('Staging mutation %s (pushed to pending)', mutation.transactionId);
    this.pending.push(mutation);
    this.EDGE = mutation.apply(this.EDGE);

    if (this.onMutation && !silent) {
      this.onMutation({
        mutation,
        document: this.EDGE,
        remote: false
      });
    }

    var txnId = mutation.transactionId;
    this.updateConsistencyFlag();
    return {
      success: () => {
        this.pendingSuccessfullySubmitted(txnId);
        this.updateConsistencyFlag();
      },
      failure: () => {
        this.pendingFailed(txnId);
        this.updateConsistencyFlag();
      }
    };
  } // Call to check if everything is nice and quiet and there are no unresolved mutations. Means this model
  // thinks both HEAD and EDGE is up to date with what the server sees.


  isConsistent() {
    return !this.inconsistentAt;
  } // Private
  // Attempts to apply any resolvable incoming patches to HEAD. Will keep patching as long as there are
  // applicable patches to be applied
  // eslint-disable-next-line complexity


  considerIncoming() {
    var mustRebase = false;
    var nextMut;
    var rebaseMutations = []; // Filter mutations that are older than the document

    if (this.HEAD) {
      var updatedAt = new Date(this.HEAD._updatedAt);

      if (this.incoming.find(mut => mut.timestamp && mut.timestamp < updatedAt)) {
        this.incoming = this.incoming.filter(mut => mut.timestamp < updatedAt);
      }
    } // Keep applying mutations as long as any apply


    var protect = 0;

    do {
      // Find next mutation that can be applied to HEAD (if any)
      if (this.HEAD) {
        nextMut = this.incoming.find(mut => mut.previousRev == this.HEAD._rev);
      } else {
        // When HEAD is null, that means the document is currently deleted. Only mutations that start with a create
        // operation will be considered.
        nextMut = this.incoming.find(mut => mut.appliesToMissingDocument());
      }

      if (nextMut) {
        var applied = this.applyIncoming(nextMut);
        mustRebase = mustRebase || applied;

        if (mustRebase) {
          rebaseMutations.push(nextMut);
        } // eslint-disable-next-line max-depth


        if (protect++ > 10) {
          throw new Error("Mutator stuck flushing incoming mutations. Probably stuck here: ".concat(JSON.stringify(nextMut)));
        }
      }
    } while (nextMut);

    if (this.incoming.length > 0 && _debug.default.enabled) {
      (0, _debug.default)('Unable to apply mutations %s', this.incoming.map(mut => mut.transactionId).join(', '));
    }

    if (mustRebase) {
      this.rebase(rebaseMutations);
    }
  } // check current consistency state, update flag and invoke callback if needed


  updateConsistencyFlag() {
    var wasConsistent = this.isConsistent();
    var isConsistent = this.pending.length == 0 && this.submitted.length == 0 && this.incoming.length == 0; // Update the consistency state, taking care not to update the timestamp if we were inconsistent and still are

    if (isConsistent) {
      this.inconsistentAt = null;
    } else if (!this.inconsistentAt) {
      this.inconsistentAt = new Date();
    } // Handle onConsistencyChanged callback


    if (wasConsistent != isConsistent && this.onConsistencyChanged) {
      if (isConsistent) {
        (0, _debug.default)('Buffered document is inconsistent');
      } else {
        (0, _debug.default)('Buffered document is consistent');
      }

      this.onConsistencyChanged(isConsistent);
    }
  } // apply an incoming patch that has been prequalified as the next in line for this document


  applyIncoming(mut) {
    if (!mut) {
      return false;
    }

    (0, _debug.default)('Applying mutation %s -> %s to rev %s', mut.previousRev, mut.resultRev, this.HEAD && this.HEAD._rev);
    this.HEAD = mut.apply(this.HEAD);

    if (this.onRemoteMutation) {
      this.onRemoteMutation(mut);
    } // Eliminate from incoming set


    this.incoming = this.incoming.filter(m => m.transactionId != mut.transactionId);

    if (this.anyUnresolvedMutations()) {
      var needRebase = this.consumeUnresolved(mut.transactionId);

      if (_debug.default.enabled) {
        (0, _debug.default)("Incoming mutation ".concat(mut.transactionId, " appeared while there were pending or submitted local mutations"));
        (0, _debug.default)("Submitted txnIds: ".concat(this.submitted.map(m => m.transactionId).join(', ')));
        (0, _debug.default)("Pending txnIds: ".concat(this.pending.map(m => m.transactionId).join(', ')));
        (0, _debug.default)("needRebase == %s", needRebase);
      }

      return needRebase;
    }

    (0, _debug.default)("Remote mutation %s arrived w/o any pending or submitted local mutations", mut.transactionId);
    this.EDGE = this.HEAD;

    if (this.onMutation) {
      this.onMutation({
        mutation: mut,
        document: this.EDGE,
        remote: true
      });
    }

    return false;
  } // Returns true if there are unresolved mutations between HEAD and EDGE, meaning we have
  // mutations that are still waiting to be either submitted, or to be confirmed by the
  // server.


  anyUnresolvedMutations() {
    return this.submitted.length > 0 || this.pending.length > 0;
  } // When an incoming mutation is applied to HEAD, this is called to remove the mutation from
  // the unresolved state. If the newly applied patch is the next upcoming unresolved mutation,
  // no rebase is needed, but we might have the wrong idea about the ordering of mutations, so in
  // that case we are given the flag `needRebase` to tell us that this mutation arrived out of order
  // in terms of our optimistic version, so a rebase is needed.


  consumeUnresolved(txnId) {
    // If we have nothing queued up, we are in sync and can apply patch with no
    // rebasing
    if (this.submitted.length == 0 && this.pending.length == 0) {
      return false;
    } // If we can consume the directly upcoming mutation, we won't have to rebase


    if (this.submitted.length != 0) {
      if (this.submitted[0].transactionId == txnId) {
        (0, _debug.default)("Remote mutation %s matches upcoming submitted mutation, consumed from 'submitted' buffer", txnId);
        this.submitted.shift();
        return false;
      }
    } else if (this.pending.length > 0 && this.pending[0].transactionId == txnId) {
      // There are no submitted, but some are pending so let's check the upcoming pending
      (0, _debug.default)("Remote mutation %s matches upcoming pending mutation, consumed from 'pending' buffer", txnId);
      this.pending.shift();
      return false;
    }

    (0, _debug.default)('The mutation was not the upcoming mutation, scrubbing. Pending: %d, Submitted: %d', this.pending.length, this.submitted.length); // The mutation was not the upcoming mutation, so we'll have to check everything to
    // see if we have an out of order situation

    this.submitted = this.submitted.filter(mut => mut.transactionId != txnId);
    this.pending = this.pending.filter(mut => mut.transactionId != txnId);
    (0, _debug.default)("After scrubbing: Pending: %d, Submitted: %d", this.pending.length, this.submitted.length); // Whether we had it or not we have either a reordering, or an unexpected mutation
    // so must rebase

    return true;
  }

  pendingSuccessfullySubmitted(pendingTxnId) {
    if (this.pending.length == 0) {
      // If there are no pending, it has probably arrived allready
      return;
    }

    var first = this.pending[0];

    if (first.transactionId == pendingTxnId) {
      // Nice, the pending transaction arrived in order
      this.submitted.push(this.pending.shift());
      return;
    } // Oh, no. Submitted out of order.


    var justSubmitted;
    var stillPending = [];
    this.pending.forEach(mutation => {
      if (mutation.transactionId == pendingTxnId) {
        justSubmitted = mutation;
        return;
      }

      stillPending.push(mutation);
    });

    if (!justSubmitted) {// Not found? Hopefully it has allready arrived. Might have been forgotten by now
    }

    this.submitted.push(justSubmitted);
    this.pending = stillPending; // Must rebase since mutation order has changed

    this.rebase([]);
  }

  pendingFailed(pendingTxnId) {
    this.pending = this.pending.filter(mutation => mutation.transactionId != pendingTxnId); // Rebase to revert document to what it looked like before the failed mutation

    this.rebase([]);
  }

  rebase(incomingMutations) {
    var oldEdge = this.EDGE;
    this.EDGE = _Mutation.default.applyAll(this.HEAD, this.submitted.concat(this.pending)); // Copy over rev, since we don't care if it changed, we only care about the content

    if (oldEdge !== null && this.EDGE !== null) {
      oldEdge._rev = this.EDGE._rev;
    }

    var changed = !(0, _isEqual2.default)(this.EDGE, oldEdge);

    if (changed && this.onRebase) {
      this.onRebase(this.EDGE, incomingMutations, this.pending);
    }
  }

}

exports.default = Document;