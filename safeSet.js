/**
 * Created by peter.pavlovich on 6/4/15.
 */

var _ = require('lodash');

var isValidString = function(obj){
  return !_.isVoid(obj) && !_.isEmpty(obj);
};

module.exports = function safeSet(obj, path, value, overwrite, returnValueSet){
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
