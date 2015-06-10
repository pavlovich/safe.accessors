/**
 * safe.accessors (c) 2015 Peter Pavlovich <pavlovich@gmail.com>
 *  safe.accessors is freely distributable under the terms of the MIT license.
 *  Documentation: https://github.com/pavlovich/safe.accessors
 *  Version '1.0.4'
 */

;(function() {

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

  sa.VERSION = '1.0.4';
  sa.isVoid   = require('./isVoid');
  sa.safeGet  = require('./safeGet');
  sa.safeSet  = require('./safeSet');
  sa.safeCall = require('./safeCall');

  sa.install  = function install(obj){
    obj.isVoid = sa.isVoid;
    obj.safeGet = sa.safeGet;
    obj.safeSet = sa.safeSet;
    obj.safeCall = sa.safeCall;
  };

  // Implement chaining
  sa.prototype = {
    value: function value() {
      return this._wrapped;
    }
  };

  sa.install(require('lodash'));

  if(freeModule) {
    freeModule.exports = sa;
  }

  if(root) {
    root.sa = sa;
  }

}.call(this));
