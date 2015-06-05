/**
 * safe.accessors (c) 2015 Peter Pavlovich <pavlovich@gmail.com>
 *  safe.accessors is freely distributable under the terms of the MIT license.
 *  Documentation: https://github.com/pavlovich/safe.accessors
 *  Version '1.0.1'
 */

;(function() {

  var _ = require('lodash');

  /** Used to determine if values are of the language type `Object`. */
  var objectTypes = {
    'function': true,
    'object': true
  };

  /** Detect free variable `exports`. */
  var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;

  /** Detect free variable `module`. */
  var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = freeExports && freeModule && typeof global == 'object' && global;

  /** Detect free variable `self`. */
  var freeSelf = objectTypes[typeof self] && self && self.Object && self;

  /** Detect free variable `window`. */
  var freeWindow = objectTypes[typeof window] && window && window.Object && window;

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports = freeModule && freeModule.exports === freeExports && freeExports;

  /**
   * Used as a reference to the global object.
   *
   * The `this` value is used if it is the global object to avoid Greasemonkey's
   * restricted `window` object, otherwise the `window` object is used.
   */
  var root = freeGlobal || ((freeWindow !== (this && this.window)) && freeWindow) || freeSelf || this;

  function sa(value) {
    /* jshint validthis: true */
    if (!(this instanceof sa)) {
      return new sa(value);
    }
    this._wrapped = value;
  }

  sa.VERSION = '1.0.0';

  sa.safeGet  = require('./safeGet');
  sa.safeSet  = require('./safeSet');
  sa.safeCall = require('./safeCall');
  sa.isVoid   = require('./isVoid');
  sa.install  = function install(obj){
    obj.safeGet = sa.safeGet;
    obj.safeSet = sa.safeSet;
    obj.safeCall = sa.safeCall;
    obj.isVoid = sa.isVoid;
  };

  // Implement chaining
  sa.prototype = {
    value: function value() {
      return this._wrapped;
    }
  };


  // Some AMD build optimizers like r.js check for condition patterns like the following:
  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    // Expose lodash to the global object when an AMD loader is present to avoid
    // errors in cases where lodash is loaded by a script tag and not intended
    // as an AMD module. See http://requirejs.org/docs/errors.html#mismatch for
    // more details.
    root.sa = sa;

    // Define as an anonymous module so, through path mapping, it can be
    // referenced as the "underscore" module.
    define(function() {
      return sa;
    });
  }
  // Check for `exports` after `define` in case a build optimizer adds an `exports` object.
  else if (freeExports && freeModule) {
    // Export for Node.js or RingoJS.
    if (moduleExports) {
      (freeModule.exports = sa).sa = sa;
    }
    // Export for Narwhal or Rhino -require.
    else {
      freeExports.sa = sa;
    }
  }
  else {
    // Export for a browser or Rhino.
    root.sa = sa;
  }

}.call(this));