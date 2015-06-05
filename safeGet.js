/**
 * Created by peter.pavlovich on 6/4/15.
 */

var _ = require('lodash');

module.exports = function safeGet(obj, path, defaultValue, allowNull, allowUndefined){
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
