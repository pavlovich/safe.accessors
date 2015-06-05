/**
 * Created by peter.pavlovich on 6/4/15.
 */

var _ = require('lodash');

module.exports = function safeSet(obj, path, value, overwrite){
  var result = value;
  var shouldOverwrite = _.isVoid(overwrite) ? true : overwrite;
  var pathComponents = path.split('.');
  _.reduce(pathComponents,
    function(memo, key){
      if(this == key){
        if(_.isVoid(memo[key])){
          if(shouldOverwrite){
            memo[key] = value;
          }
          result = memo[key];
          return result;
        }
        memo[key] = value;
        return value;
      }else{
        if(!_.isVoid(memo[key])){
          memo[key] = {};
        }
        return memo[key];
      }
    }, obj, _.last(pathComponents));

  return result;
};
