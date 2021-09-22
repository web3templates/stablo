"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _parse = _interopRequireDefault(require("./parse"));

var _Descender = _interopRequireDefault(require("./Descender"));

var _Expression = _interopRequireDefault(require("./Expression"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Matcher {
  constructor(active, parent) {
    _defineProperty(this, "active", void 0);

    _defineProperty(this, "recursives", void 0);

    _defineProperty(this, "payload", void 0);

    this.active = active || [];

    if (parent) {
      this.recursives = parent.recursives;
      this.payload = parent.payload;
    } else {
      this.recursives = [];
    }

    this.extractRecursives();
  }

  setPayload(payload) {
    this.payload = payload;
    return this;
  } // Moves any recursive descenders onto the recursive track, removing them from
  // the active set


  extractRecursives() {
    // console.log(JSON.stringify(this.active))
    this.active = this.active.filter(descender => {
      if (descender.isRecursive()) {
        this.recursives.push(...descender.extractRecursives());
        return false;
      }

      return true;
    });
  } // Find recursives that are relevant now and should be considered part of the active set


  activeRecursives(probe) {
    return this.recursives.filter(descender => {
      var head = descender.head; // Constraints are always relevant

      if (head.isConstraint()) {
        return true;
      } // Index references are only relevant for indexable values


      if (probe.containerType() == 'array' && head.isIndexReference()) {
        return true;
      } // Attribute references are relevant for plain objects


      if (probe.containerType() == 'object') {
        if (head.isAttributeReference() && probe.hasAttribute(head.name())) {
          return true;
        }
      }

      return false;
    });
  }

  match(probe) {
    return this.iterate(probe).extractMatches(probe);
  }

  iterate(probe) {
    var newActiveSet = [];
    this.active.concat(this.activeRecursives(probe)).forEach(descender => {
      newActiveSet.push(...descender.iterate(probe));
    });
    return new Matcher(newActiveSet, this);
  } // Returns true if any of the descenders in the active or recursive set
  // consider the current state a final destination


  isDestination() {
    var arrival = this.active.find(descender => {
      if (descender.hasArrived()) {
        return true;
      }

      return false;
    });
    return !!arrival;
  }

  hasRecursives() {
    return this.recursives.length > 0;
  } // Returns any payload delivieries and leads that needs to be followed to complete
  // the process.


  extractMatches(probe) {
    var leads = [];
    var targets = [];
    this.active.forEach(descender => {
      if (descender.hasArrived()) {
        // This was allready arrived, so matches this value, not descenders
        targets.push(new _Expression.default({
          type: 'alias',
          target: 'self'
        }));
        return;
      }

      if (probe.containerType() == 'array' && !descender.head.isIndexReference()) {
        // This descender does not match an indexable value
        return;
      }

      if (probe.containerType() == 'object' && !descender.head.isAttributeReference()) {
        // This descender never match a plain object
        return;
      } // const newDescenders = descender.descend()
      // console.log('newDescenders', newDescenders)


      if (descender.tail) {
        // Not arrived yet
        var matcher = new Matcher(descender.descend(), this);
        descender.head.toFieldReferences().forEach(field => {
          leads.push({
            target: descender.head,
            matcher: matcher
          });
        });
      } else {
        // arrived
        targets.push(descender.head);
      }
    }); // If there are recursive terms, we need to add a lead for every descendant ...

    if (this.hasRecursives()) {
      // The recustives matcher will have no active set, only inherit recursives from this
      var recursivesMatcher = new Matcher([], this);

      if (probe.containerType() == 'array') {
        var length = probe.length();

        for (var i = 0; i < length; i++) {
          leads.push({
            target: _Expression.default.indexReference(i),
            matcher: recursivesMatcher
          });
        }
      } else if (probe.containerType() == 'object') {
        probe.attributeKeys().forEach(name => {
          leads.push({
            target: _Expression.default.attributeReference(name),
            matcher: recursivesMatcher
          });
        });
      }
    }

    var result = {
      leads: leads
    };

    if (targets.length > 0) {
      result.delivery = {
        targets: targets,
        payload: this.payload
      };
    }

    return result;
  }

  static fromPath(jsonpath) {
    var descender = new _Descender.default(null, new _Expression.default((0, _parse.default)(jsonpath)));
    return new Matcher(descender.descend());
  }

}

exports.default = Matcher;