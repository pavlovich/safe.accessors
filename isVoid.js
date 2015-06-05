/**
 * Created by peter.pavlovich on 6/4/15.
 */

var _ = require('lodash');

module.exports = function isVoid(value){
  return _.isNull(value) || _.isUndefined(value);
};
