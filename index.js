/**
 * safe.accessors (c) 2015 Peter Pavlovich <pavlovich@gmail.com>
 *  safe.accessors is freely distributable under the terms of the MIT license.
 *  Documentation: https://github.com/pavlovich/safe.accessors
 *  Version '1.0.0'
 */

'use strict';

var _ = require('lodash');

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

module.exports = sa;
