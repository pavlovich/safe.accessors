/**
 * Created by peter.pavlovich on 6/3/15.
 */

//  safeaccessors
//  (c) 2015 Peter Pavlovich <pavlovich aet gmail dot com>
//  safeaccessors is freely distributable under the terms of the MIT license.
//  Documentation: https://github.com/epeli/underscore.string
//  Some code is borrowed from underscore.string.
//  Version '1.0.0'

'use strict';

var _ = require('lodash');

var isVoid = function isVoid(value){
  return _.isNull(value) || _.isUndefined(value);
};

var safeCall = function safeCall(obj, path, defaultValue, functionToCall, context, allowNull, allowUndefined, defaultReturn, allowNullResult, allowUndefinedResult){
  var shouldAllowNullResult = _.isUndefined(allowNullResult) ? true : allowNullResult;
  var shouldAllowUndefinedResult = _.isUndefined(allowUndefinedResult) ? true : allowUndefinedResult;

  var res = _.safeGet(obj, path, defaultValue, allowNull, allowUndefined);
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

  return _.isUndefined(res) ? (shouldAllowUndefinedResult ? res : defaultReturn) : _.isNull(res) ? (shouldAllowNullResult ? res : defaultReturn) : res;
};

//function(obj, path, defaultValue, allowNull){
//  var result = null;
//  var pathComponents = path.split('.');
//  _.reduce(pathComponents,
//    function(memo, key){
//      if(memo[key]){
//        return memo[key]
//      }else{
//        return {};
//      }
//    }, obj);
//
//  if(result == null && !allowNull){
//    result = defaultValue;
//  }
//
//  return result;
//};


var safeGet = function safeGet(obj, path, defaultValue, allowNull, allowUndefined){
  var res = obj;
  var hasPath = _.isString(path) && !_.isEmpty(path);
  var hasDefault = !_.isUndefined(defaultValue);

  if(_.isUndefined(obj)){
    if(hasPath){
      return allowUndefined ? undefined : hasDefault ? (_.isNull(defaultValue) ? (allowNull ? defaultValue : obj) : defaultValue) : obj;
    }else{
      return allowUndefined ? obj : (hasDefault ? (_.isNull(defaultValue) ? (allowNull ? defaultValue : obj) : defaultValue) : obj);
    }
  }

  if(_.isNull(obj)){
    if(hasPath){
      return hasDefault ? defaultValue : undefined;
    }else{
      return allowNull ? obj : hasDefault ? defaultValue : allowUndefined ? defaultValue : obj;
    }
  }

  if(hasPath){
    var attribNames = path.split('.');
    var tripped = false;
    res = obj;
    _.each(attribNames, function(attribName){
      if(_.isVoid(res)){
        tripped = true;
        return false;
      }
      res = res[attribName];
    });

    res = tripped ? (allowUndefined ? undefined : (hasDefault ? (_.isNull(defaultValue) ? (allowNull ? defaultValue : undefined) : defaultValue) : undefined)) : res;

  }

  return _.isUndefined(res) ? (allowUndefined ? res : (hasDefault ? (_.isNull(defaultValue) ? (allowNull ? defaultValue : undefined) : defaultValue) : undefined)) : res;
};

var safeSet = function safeSet(obj, path, value, overwrite){
  var result = value;
  var shouldOverwrite = (_.isUndefined(overwrite) || _.isNull(overwrite)) ? true : overwrite;
  var pathComponents = path.split('.');
  _.reduce(pathComponents,
    function(memo, key){
      var isDefined = !(_.isUndefined(memo[key]) || _.isNull(memo[key]));
      if(this == key){
        if(isDefined){
          if(shouldOverwrite){
            memo[key] = value;
          }
          result = memo[key];
          return result;
        }
        memo[key] = value;
        return value;
      }else{
        if(!isDefined){
          memo[key] = {};
        }
        return memo[key];
      }
    }, obj, _.last(pathComponents));

  return result;
};


function sa(value) {
  /* jshint validthis: true */
  if (!(this instanceof sa)) {
    return new sa(value);
  }
  this._wrapped = value;
}

sa.VERSION = '1.0.0';

sa.safeGet         = safeGet;
sa.safeSet         = safeSet;
sa.safeCall        = safeCall;
sa.isVoid          = isVoid;

// Implement chaining
sa.prototype = {
  value: function value() {
    return this._wrapped;
  }
};

module.exports = sa;

_.safeGet = safeGet;
_.safeSet = safeSet;
_.safeCall = safeCall;
_.isVoid = isVoid;
