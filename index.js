/**
 * safe.accessors (c) 2015 Peter Pavlovich <pavlovich@gmail.com>
 *  safe.accessors is freely distributable under the terms of the MIT license.
 *  Documentation: https://github.com/pavlovich/safe.accessors
 *  Version '1.0.5'
 */

;(function() {

  if(typeof _ == 'undefined'){
    throw 'safe.accessors requires lowdash or underscore.';
  }

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

  var sa = {};

  var isVoid = function isVoid(value){
    return _.isNull(value) || _.isUndefined(value);
  };

  var safeCall = function safeCall(obj, path, defaultValue, functionToCall, context, allowNull, allowUndefined, defaultReturn, allowNullResult, allowUndefinedResult){
    var shouldAllowNullResult = _.isUndefined(allowNullResult) ? true : allowNullResult;
    var shouldAllowUndefinedResult = _.isUndefined(allowUndefinedResult) ? true : allowUndefinedResult;

    var res = safeGet(obj, path, defaultValue, allowNull, allowUndefined);
    var hasFunction = _.isFunction(functionToCall);
    //var hasDefault = !_.isUndefined(defaultValue);

    if(hasFunction) {
      if (_.isNull(res)) {
        if(allowNull) {
          res = functionToCall.call(context, res);
        }else {
          return defaultReturn;
        }
      }else if(_.isUndefined(res)){
        if(allowUndefined){
          res = functionToCall.call(context, res);
        }else{
          return defaultReturn;
        }
      }else {
        res = functionToCall.call(context, res);
      }
    }

    return _.isUndefined(res) ? (shouldAllowUndefinedResult ? res : defaultReturn) : (_.isNull(res) ? (shouldAllowNullResult ? res : defaultReturn) : res);
  };

  var safeGet = function safeGet(obj, path, defaultValue, allowNull, allowUndefined){
    var res = obj;
    var hasPath = _.isString(path) && !_.isEmpty(path);
    var hasDefault = !_.isUndefined(defaultValue);

    if(_.isUndefined(obj)){
      if(hasPath){
        return allowUndefined ? undefined : (hasDefault ? (_.isNull(defaultValue) ? (allowNull ? defaultValue : obj) : defaultValue) : obj);
      }else{
        return allowUndefined ? obj : (hasDefault ? (_.isNull(defaultValue) ? (allowNull ? defaultValue : obj) : defaultValue) : obj);
      }
    }

    if(_.isNull(obj)){
      if(hasPath){
        return hasDefault ? defaultValue : undefined;
      }else{
        return allowNull ? obj : (hasDefault ? defaultValue : (allowUndefined ? defaultValue : obj));
      }
    }

    if(hasPath){
      var attribNames = path.split('.');
      var tripped = false;
      res = obj;
      _.each(attribNames, function(attribName){
        res = res[attribName];
        if(_.isVoid(res)){
          tripped = true;
          return false;
        }
      });

      res = tripped ? (allowUndefined ? undefined : (hasDefault ? (_.isNull(defaultValue) ? (allowNull ? defaultValue : undefined) : defaultValue) : undefined)) : res;

    }

    return res;
  };

  var safeSet = function safeSet(obj, path, value, overwrite, returnValueSet){

    var isValidString = function(obj){
      return !_.isVoid(obj) && !_.isEmpty(obj);
    };

    var target = _.isVoid(obj) ? {} : obj;
    var result = returnValueSet ? value : target;
    var shouldOverwrite = _.isVoid(overwrite) ? true : overwrite;
    if(!isValidString(path)){
      return overwrite ? value : (returnValueSet ? value : target);
    }
    var pathComponents = path.split('.');
    _.reduce(pathComponents,
      function(memo, key){
        if(isValidString(key)) {
          if (this == key) {
            if (_.isVoid(memo[key])) {
              memo[key] = value;
              result = value;
            } else {
              if (shouldOverwrite) {
                memo[key] = value;
                result = value;
              } else {
                result = memo[key];
              }
            }
            return result;
          }else{
            if(_.isVoid(memo[key])){
              memo[key] = {};
              return memo[key];
            }else{
              return memo[key];
            }
          }
        }else{
          console.log('path provided contains a null/empty component: ' + path);
          return memo;
        }
      }, target, _.last(pathComponents));

    return returnValueSet ? result : target;
  };

  sa.VERSION = '1.0.5';
  sa.isVoid   = isVoid;
  sa.safeGet  = safeGet;
  sa.safeSet  = safeSet;
  sa.safeCall = safeCall;

  sa.install  = function install(obj){
    obj.isVoid = sa.isVoid;
    obj.safeGet = sa.safeGet;
    obj.safeSet = sa.safeSet;
    obj.safeCall = sa.safeCall;
  };

  if(freeModule) {
    freeModule.exports = sa;
  } else {
    root.sa = sa;
  }

  if(typeof _ !== 'undefined'){
    sa.install(_);
  }

}.call(this));
