/**
 * Created by peter.pavlovich on 6/4/15.
 */

var _ = require('lodash');

module.exports = function safeCall(obj, path, defaultValue, functionToCall, context, allowNull, allowUndefined, defaultReturn, allowNullResult, allowUndefinedResult){
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

  return _.isUndefined(res) ? (shouldAllowUndefinedResult ? res : defaultReturn) : (_.isNull(res) ? (shouldAllowNullResult ? res : defaultReturn) : res);
};