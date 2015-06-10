/**
 * Created by peter.pavlovich on 5/19/15.
 */


var chai = require('chai');

var assert = chai.assert,
  expect = chai.expect,
  should = chai.should();

_ = require('lodash');

require('../../index');


describe('The safeCall utility function,', function(){

  var NULL = "NULLX";
  var UNDEF = "UNDEF";
  var DEFAULT_VAL = '___MyDeFaUlT_vAlUe___';
  var DEFAULT_RET = '___MyDeFaUlT_ReTuRn_VaLuE___';
  var NULL_PRODUCER = 'null_producer';
  var UNDEF_PRODUCER = 'undefined_producer';

  var cbf = function(input){
    if(_.isNull(input)) {
      return NULL;
    }

    if(_.isUndefined(input)){
      return UNDEF;
    }

    if(input === NULL_PRODUCER){
      return null;
    }

    if(input === UNDEF_PRODUCER){
      return undefined;
    }

    return input;
  };

  it('should be a function', function () {
    expect(typeof _.safeCall).to.equal("function");
  });

  describe('given a null input object,', function() {
    describe('given no function callback', function(){
      describe('given no other parameters,', function () {
        it('should return null', function () {
          expect(_.safeCall(null)).to.equal(null);
        });
      });
      describe('given an undefined path, default value, function, allowsNull flag and allowing for undefined results,', function () {
        it('should return undefined', function () {
          expect(_.safeCall(null, undefined, undefined, undefined, undefined, undefined, true)).to.equal(undefined);
        });
      });
      describe('given a null path,', function () {
        it('should return null', function () {
          expect(_.safeCall(null, null)).to.equal(null);
        });
      });
      describe('given a null path and null default,', function () {
        it('should return null', function () {
          expect(_.safeCall(null, null, null)).to.equal(null);
        });
      });
      describe('given a null path and non-null default,', function () {
        it('should return the default', function () {
          expect(_.safeCall(null, null, DEFAULT_VAL)).to.equal(DEFAULT_VAL);
        });
      });
      describe('given a non-null, empty path and no default,', function () {
        it('should return null', function () {
          expect(_.safeCall(null, '')).to.equal(null);
        });
      });
      describe('given a non-null, empty path and null default,', function () {
        it('should return null', function () {
          expect(_.safeCall(null, '', null)).to.equal(null);
        });
      });
      describe('given a non-null, empty path and non-null default,', function () {
        it('should return the default', function () {
          expect(_.safeCall(null, '', DEFAULT_VAL)).to.equal(DEFAULT_VAL);
        });
      });
      describe('given a non-null, empty path, a non-null default and allowing nulls,', function () {
        it('should return null', function () {
          expect(_.safeCall(null, '', DEFAULT_VAL, undefined, undefined, true)).to.equal(null);
        });
      });
      describe('given a non-empty path,', function () {
        it('should return undefined', function () {
          expect(_.safeCall(null, 'test')).to.equal(undefined);
        });
      });
      describe('given a non-empty path, a non-null default,', function () {
        it('should return the default', function () {
          expect(_.safeCall(null, 'test', DEFAULT_VAL)).to.equal(DEFAULT_VAL);
        });
      });
      describe('given a non-empty path, a non-null default and allowing nulls,', function () {
        it('should return the default', function () {
          expect(_.safeCall(null, 'test', DEFAULT_VAL, undefined, undefined, true)).to.equal(DEFAULT_VAL);
        });
      });
      describe('given a non-empty path, a non-null default and allowing nulls and undefineds,', function () {
        it('should return the default', function () {
          expect(_.safeCall(null, 'test', DEFAULT_VAL, undefined, undefined, true, true)).to.equal(DEFAULT_VAL);
        });
      });
      describe('given a non-empty path, an undefined and allowing nulls and undefineds,', function () {
        it('should return the undefined', function () {
          expect(_.safeCall(null, 'test', undefined, undefined, undefined, true, true)).to.equal(undefined);
        });
      });
      describe('given a non-empty path, an undefined and allowing undefineds,', function () {
        it('should return the undefined', function () {
          expect(_.safeCall(null, 'test', undefined, undefined, undefined, false, true)).to.equal(undefined);
        });
      });
      describe('given a non-empty, two-part, an undefined and allowing undefineds,', function () {
        it('should return the undefined', function () {
          expect(_.safeCall(null, 'test.two', undefined, undefined, undefined, false, true)).to.equal(undefined);
        });
      });
    });

    describe('given a real function callback', function(){
      describe('given no other parameters,', function(){
        it('should return undefined', function(){
          expect(_.safeCall(null, undefined, undefined, cbf)).to.equal(undefined);
        });
      });
      describe('given an undefined path, default value, function, allowsNull flag and allowing for undefined results,', function(){
        it('should return UNDEF', function(){
          expect(_.safeCall(null, undefined, undefined, cbf, undefined, undefined, true)).to.equal(UNDEF);
        });
      });
      describe('given a null path,', function(){
        it('should return undefined', function(){
          expect(_.safeCall(null, null, undefined, cbf)).to.equal(undefined);
        });
      });
      describe('given a null path and null default,', function(){
        it('should return undefined', function(){
          expect(_.safeCall(null, null, null, cbf)).to.equal(undefined);
        });
      });
      describe('given a null path and non-null default,', function(){
        it('should return the default', function(){
          expect(_.safeCall(null, null, DEFAULT_VAL, cbf)).to.equal(DEFAULT_VAL);
        });
      });
      describe('given a non-null, empty path and no default,', function(){
        it('should return undefined', function(){
          expect(_.safeCall(null, '', undefined, cbf)).to.equal(undefined);
        });
      });
      describe('given a non-null, empty path and null default,', function(){
        it('should return undefined', function(){
          expect(_.safeCall(null, '', null, cbf)).to.equal(undefined);
        });
      });
      describe('given a non-null, empty path and non-null default,', function(){
        it('should return the default', function(){
          expect(_.safeCall(null, '', DEFAULT_VAL, cbf)).to.equal(DEFAULT_VAL);
        });
      });
      describe('given a non-null, empty path, a non-null default and allowing nulls,', function(){
        it('should return NULL', function(){
          expect(_.safeCall(null, '', DEFAULT_VAL, cbf, undefined, true)).to.equal(NULL);
        });
      });
      describe('given a non-empty path,', function(){
        it('should return undefined', function(){
          expect(_.safeCall(null, 'test', undefined, cbf)).to.equal(undefined);
        });
      });
      describe('given a non-empty path, a non-null default,', function(){
        it('should return the default', function(){
          expect(_.safeCall(null, 'test', DEFAULT_VAL, cbf)).to.equal(DEFAULT_VAL);
        });
      });
      describe('given a non-empty path, a non-null default and allowing nulls,', function(){
        it('should return the default', function(){
          expect(_.safeCall(null, 'test', DEFAULT_VAL, cbf, undefined, true)).to.equal(DEFAULT_VAL);
        });
      });
      describe('given a non-empty path, a non-null default and allowing nulls and undefineds,', function(){
        it('should return the default', function(){
          expect(_.safeCall(null, 'test', DEFAULT_VAL, cbf, undefined, true, true)).to.equal(DEFAULT_VAL);
        });
      });
      describe('given a non-empty path, an undefined and allowing nulls and undefineds,', function(){
        it('should return UNDEF', function(){
          expect(_.safeCall(null, 'test', undefined, cbf, undefined, true, true)).to.equal(UNDEF);
        });
      });
      describe('given a non-empty path, an undefined and allowing undefineds,', function(){
        it('should return UNDEF', function(){
          expect(_.safeCall(null, 'test', undefined, cbf, undefined, false, true)).to.equal(UNDEF);
        });
      });
      describe('given a non-empty, two-part, an undefined and allowing undefineds,', function(){
        it('should return UNDEF', function(){
          expect(_.safeCall(null, 'test.two', undefined, cbf, undefined, false, true)).to.equal(UNDEF);
        });
      });
    });
  });

  describe('given an undefined input object,', function(){
    describe('given no callback function', function() {
      describe('given no other parameters,', function () {
        it('should return undefined', function () {
          expect(_.safeCall(undefined)).to.equal(undefined);
        });
      });
      describe('given an undefined path, default value, allowsNull flag and allowing for undefined results,', function () {
        it('should return undefined', function () {
          expect(_.safeCall(undefined, undefined, undefined, undefined, undefined, undefined, true)).to.equal(undefined);
        });
      });
      describe('given a null path,', function () {
        it('should return undefined', function () {
          expect(_.safeCall(undefined, null)).to.equal(undefined);
        });
      });
      describe('given a null path and null default,', function () {
        it('should return undefined', function () {
          expect(_.safeCall(undefined, null, null)).to.equal(undefined);
        });
      });
      describe('given a null path and null default and allowing nulls,', function () {
        it('should return undefined', function () {
          expect(_.safeCall(undefined, null, null, undefined, undefined, true)).to.equal(null);
        });
      });
      describe('given a null path and non-null default,', function () {
        it('should return the default', function () {
          expect(_.safeCall(undefined, null, DEFAULT_VAL)).to.equal(DEFAULT_VAL);
        });
      });
      describe('given a non-null, empty path and no default,', function () {
        it('should return undefined', function () {
          expect(_.safeCall(undefined, '')).to.equal(undefined);
        });
      });
      describe('given a non-null, empty path and null default,', function () {
        it('should return undefined', function () {
          expect(_.safeCall(undefined, '', null)).to.equal(undefined);
        });
      });
      describe('given a non-null, empty path and non-null default,', function () {
        it('should return the default', function () {
          expect(_.safeCall(undefined, '', DEFAULT_VAL)).to.equal(DEFAULT_VAL);
        });
      });
      describe('given a non-null, empty path, a non-null default and allowing nulls,', function () {
        it('should return the default', function () {
          expect(_.safeCall(undefined, '', DEFAULT_VAL, undefined, undefined, true)).to.equal(DEFAULT_VAL);
        });
      });
      describe('given a non-null, empty path, a non-null default and allowing nulls and undefineds,', function () {
        it('should return undefined', function () {
          expect(_.safeCall(undefined, '', DEFAULT_VAL, undefined, undefined, true, true)).to.equal(undefined);
        });
      });
      describe('given a non-null, empty path, a non-null default and not allowing nulls but allowing undefineds,', function () {
        it('should return undefined', function () {
          expect(_.safeCall(undefined, '', DEFAULT_VAL, undefined, undefined, false, true)).to.equal(undefined);
        });
      });
      describe('given a non-empty path,', function () {
        it('should return undefined', function () {
          expect(_.safeCall(undefined, 'test')).to.equal(undefined);
        });
      });
      describe('given a non-empty path, a non-null default,', function () {
        it('should return the default', function () {
          expect(_.safeCall(undefined, 'test', DEFAULT_VAL)).to.equal(DEFAULT_VAL);
        });
      });
      describe('given a non-empty path, a non-null default and allowing nulls,', function () {
        it('should return the default', function () {
          expect(_.safeCall(undefined, 'test', DEFAULT_VAL, undefined, undefined, true)).to.equal(DEFAULT_VAL);
        });
      });
      describe('given a non-empty path, a non-null default and allowing nulls and undefineds,', function () {
        it('should return the default', function () {
          expect(_.safeCall(undefined, 'test', DEFAULT_VAL, undefined, undefined, true, true)).to.equal(undefined);
        });
      });
      describe('given a non-empty path, an undefined and allowing nulls and undefineds,', function () {
        it('should return the undefined', function () {
          expect(_.safeCall(undefined, 'test', undefined, undefined, true, true)).to.equal(undefined);
        });
      });
      describe('given a non-empty path, an undefined and allowing undefineds,', function () {
        it('should return the undefined', function () {
          expect(_.safeCall(undefined, 'test', undefined, undefined, undefined, false, true)).to.equal(undefined);
        });
      });
      describe('given a non-empty, two-part, an undefined and allowing undefineds,', function () {
        it('should return the undefined', function () {
          expect(_.safeCall(undefined, 'test.two', undefined, undefined, undefined, false, true)).to.equal(undefined);
        });
      });
    });

    describe('given a real callback function', function() {
      describe('given no other parameters,', function () {
        it('should return undefined', function () {
          expect(_.safeCall(undefined, undefined, undefined, cbf)).to.equal(undefined);
        });
      });
      describe('given an undefined path, default value, allowsNull flag and allowing for undefined results,', function () {
        it('should return UNDEF', function () {
          expect(_.safeCall(undefined, undefined, undefined, cbf, undefined, undefined, true)).to.equal(UNDEF);
        });
      });
      describe('given a null path,', function () {
        it('should return undefined', function () {
          expect(_.safeCall(undefined, null, undefined, cbf)).to.equal(undefined);
        });
      });
      describe('given a null path and null default,', function () {
        it('should return undefined', function () {
          expect(_.safeCall(undefined, null, null, cbf)).to.equal(undefined);
        });
      });
      describe('given a null path and null default and allowing nulls,', function () {
        it('should return NULL', function () {
          expect(_.safeCall(undefined, null, null, cbf, undefined, true)).to.equal(NULL);
        });
      });
      describe('given a null path and non-null default,', function () {
        it('should return the default', function () {
          expect(_.safeCall(undefined, null, DEFAULT_VAL, cbf)).to.equal(DEFAULT_VAL);
        });
      });
      describe('given a non-null, empty path and no default,', function () {
        it('should return undefined', function () {
          expect(_.safeCall(undefined, '', undefined, cbf)).to.equal(undefined);
        });
      });
      describe('given a non-null, empty path and null default,', function () {
        it('should return undefined', function () {
          expect(_.safeCall(undefined, '', null, cbf)).to.equal(undefined);
        });
      });
      describe('given a non-null, empty path and non-null default,', function () {
        it('should return the default', function () {
          expect(_.safeCall(undefined, '', DEFAULT_VAL, cbf)).to.equal(DEFAULT_VAL);
        });
      });
      describe('given a non-null, empty path, a non-null default and allowing nulls,', function () {
        it('should return the default', function () {
          expect(_.safeCall(undefined, '', DEFAULT_VAL, cbf, undefined, true)).to.equal(DEFAULT_VAL);
        });
      });
      describe('given a non-null, empty path, a non-null default and allowing nulls and undefineds,', function () {
        it('should return UNDEF', function () {
          expect(_.safeCall(undefined, '', DEFAULT_VAL, cbf, undefined, true, true)).to.equal(UNDEF);
        });
      });
      describe('given a non-null, empty path, a non-null default and not allowing nulls but allowing undefineds,', function () {
        it('should return UNDEF', function () {
          expect(_.safeCall(undefined, '', DEFAULT_VAL, cbf, undefined, false, true)).to.equal(UNDEF);
        });
      });
      describe('given a non-empty path,', function () {
        it('should return undefined', function () {
          expect(_.safeCall(undefined, 'test', undefined, cbf)).to.equal(undefined);
        });
      });
      describe('given a non-empty path, a non-null default,', function () {
        it('should return the default', function () {
          expect(_.safeCall(undefined, 'test', DEFAULT_VAL, cbf)).to.equal(DEFAULT_VAL);
        });
      });
      describe('given a non-empty path, a non-null default and allowing nulls,', function () {
        it('should return the default', function () {
          expect(_.safeCall(undefined, 'test', DEFAULT_VAL, cbf, undefined, true)).to.equal(DEFAULT_VAL);
        });
      });
      describe('given a non-empty path, a non-null default and allowing nulls and undefineds,', function () {
        it('should return the UNDEF', function () {
          expect(_.safeCall(undefined, 'test', DEFAULT_VAL, cbf, undefined, true, true)).to.equal(UNDEF);
        });
      });
      describe('given a non-empty path, an undefined and allowing nulls and undefineds,', function () {
        it('should return the undefined', function () {
          expect(_.safeCall(undefined, 'test', undefined, cbf, true, true)).to.equal(undefined);
        });
      });
      describe('given a non-empty path, an undefined and allowing undefineds,', function () {
        it('should return UNDEF', function () {
          expect(_.safeCall(undefined, 'test', undefined, cbf, undefined, false, true)).to.equal(UNDEF);
        });
      });
      describe('given a non-empty, two-part, an undefined and allowing undefineds,', function () {
        it('should return UNDEF', function () {
          expect(_.safeCall(undefined, 'test.two', undefined, cbf, undefined, false, true)).to.equal(UNDEF);
        });
      });
    });
  });

  describe('given a simple TEST input object,', function(){
    var t4 = 'test 4';
    var L3 = {
      four: t4,
      truth: true,
      falseness: false,
      number: 23,
      aString: 'aString'
    };
    var t2 = 'test 2';
    var L2 = {
      test: t2,
      three: L3
    };
    var t1 = 'test 1';
    var L1 = {
      test: t1,
      two: L2
    };
    var t = 42;
    var TEST = {
      one: L1,
      test: t
    };

    describe('given no callback function', function() {
      describe('given no other parameters,', function () {
        it('should return TEST', function () {
          expect(_.safeCall(TEST)).to.equal(TEST);
        });
      });
      describe('given an undefined path, default value, allowsNull flag and allowing for undefined results,', function () {
        it('should return TEST', function () {
          expect(_.safeCall(TEST, undefined, undefined, undefined, undefined, undefined, true)).to.equal(TEST);
        });
      });
      describe('given a null path,', function () {
        it('should return TEST', function () {
          expect(_.safeCall(TEST, null)).to.equal(TEST);
        });
      });
      describe('given a null path and null default,', function () {
        it('should return TEST', function () {
          expect(_.safeCall(TEST, null, null)).to.equal(TEST);
        });
      });
      describe('given a null path and null default and allowing nulls,', function () {
        it('should return TEST', function () {
          expect(_.safeCall(TEST, null, null, undefined, undefined, true)).to.equal(TEST);
        });
      });
      describe('given a null path and non-null default,', function () {
        it('should return the TEST', function () {
          expect(_.safeCall(TEST, null, DEFAULT_VAL)).to.equal(TEST);
        });
      });
      describe('given a non-null, empty path and no default,', function () {
        it('should return TEST', function () {
          expect(_.safeCall(TEST, '')).to.equal(TEST);
        });
      });
      describe('given a non-null, empty path and null default,', function () {
        it('should return TEST', function () {
          expect(_.safeCall(TEST, '', null)).to.equal(TEST);
        });
      });
      describe('given a non-null, empty path and non-null default,', function () {
        it('should return TEST', function () {
          expect(_.safeCall(TEST, '', DEFAULT_VAL)).to.equal(TEST);
        });
      });
      describe('given a non-null, empty path, a non-null default and allowing nulls,', function () {
        it('should return the TEST', function () {
          expect(_.safeCall(TEST, '', DEFAULT_VAL, undefined, undefined, true)).to.equal(TEST);
        });
      });
      describe('given a non-null, empty path, a non-null default and allowing nulls and undefineds,', function () {
        it('should return TEST', function () {
          expect(_.safeCall(TEST, '', DEFAULT_VAL, undefined, undefined, true, true)).to.equal(TEST);
        });
      });
      describe('given a non-null, empty path, a non-null default and not allowing nulls but allowing undefineds,', function () {
        it('should return TEST', function () {
          expect(_.safeCall(TEST, '', DEFAULT_VAL, undefined, undefined, false, true)).to.equal(TEST);
        });
      });
      describe('given a non-empty, unknown path,', function () {
        it('should return undefined', function () {
          expect(_.safeCall(TEST, 'unknown')).to.equal(undefined);
        });
      });
      describe('given a non-empty, unknown path, a non-null default,', function () {
        it('should return the default', function () {
          expect(_.safeCall(TEST, 'unknown', DEFAULT_VAL)).to.equal(DEFAULT_VAL);
        });
      });
      describe('given a non-empty, unknown path, a non-null default and allowing nulls,', function () {
        it('should return the default', function () {
          expect(_.safeCall(TEST, 'unknown', DEFAULT_VAL, undefined, undefined, true)).to.equal(DEFAULT_VAL);
        });
      });
      describe('given a non-empty, unknown path, a non-null default and allowing nulls and undefineds,', function () {
        it('should return the default', function () {
          expect(_.safeCall(TEST, 'unknown', DEFAULT_VAL, undefined, undefined, true, true)).to.equal(undefined);
        });
      });
      describe('given a non-empty, unknown path, an undefined and allowing nulls and undefineds,', function () {
        it('should return the undefined', function () {
          expect(_.safeCall(TEST, 'unknown', undefined, undefined, undefined, true, true)).to.equal(undefined);
        });
      });
      describe('given a non-empty, unknown path, an undefined and allowing nulls and undefineds,', function () {
        it('should return the undefined', function () {
          expect(_.safeCall(TEST, 'unknown', undefined, undefined, undefined, true, true)).to.equal(undefined);
        });
      });
      describe('given a non-empty, unknown path, an undefined and allowing undefineds,', function () {
        it('should return the undefined', function () {
          expect(_.safeCall(TEST, 'unknown', undefined, undefined, undefined, false, true)).to.equal(undefined);
        });
      });
      describe('given a non-empty, known path to an object,', function () {
        it('should return the requested value', function () {
          expect(_.safeCall(TEST, 'one')).to.equal(L1);
        });
      });
      describe('given a non-empty, known path to a primitive,', function () {
        it('should return the requested primitive value', function () {
          expect(_.safeCall(TEST, 'test')).to.equal(t);
        });
      });
      describe('given a non-empty, two-part, an undefined and allowing undefineds,', function () {
        it('should return the undefined', function () {
          expect(_.safeCall(TEST, 'unknown.unknown2', undefined, undefined, undefined, false, true)).to.equal(undefined);
        });
      });
      describe('given a non-empty, two-part, first known and second unknown path, an undefined default and allowing undefineds,', function () {
        it('should return the undefined', function () {
          expect(_.safeCall(TEST, 'one.unknown', undefined, undefined, undefined, false, true)).to.equal(undefined);
        });
      });
      describe('given a non-empty, two-part, first known and second unknown path, an undefined default and allowing undefineds,', function () {
        it('should return the undefined', function () {
          expect(_.safeCall(TEST, 'one.unknown', DEFAULT_VAL, undefined, undefined, false, true)).to.equal(undefined);
        });
      });
      describe('given a non-empty, two-part, first known and second unknown path, an undefined default and not allowing undefineds,', function () {
        it('should return the default', function () {
          expect(_.safeCall(TEST, 'one.unknown', DEFAULT_VAL, undefined, undefined, false, false)).to.equal(DEFAULT_VAL);
        });
      });
      describe('given a non-empty, two-part, known first and second path,', function () {
        it('should return the requested value', function () {
          expect(_.safeCall(TEST, 'one.two', DEFAULT_VAL)).to.equal(L2);
        });
      });
      describe('given a non-empty, two-part, known first and second path, an undefined default and not allowing nulls or undefineds,', function () {
        it('should return the requested value', function () {
          expect(_.safeCall(TEST, 'one.two', undefined, undefined, undefined, false, false)).to.equal(L2);
        });
      });
      describe('given a non-empty, two-part, known first and second path, an undefined default and not allowing nulls but allowing undefineds,', function () {
        it('should return the requested value', function () {
          expect(_.safeCall(TEST, 'one.two', undefined, undefined, undefined, false, true)).to.equal(L2);
        });
      });
      describe('given a non-empty, two-part, known first and second path, an undefined default and allowing nulls but not undefineds,', function () {
        it('should return the requested value', function () {
          expect(_.safeCall(TEST, 'one.two', undefined, undefined, undefined, true, false)).to.equal(L2);
        });
      });
      describe('given a non-empty, two-part, known first and second path, an undefined default and allowing nulls or undefineds,', function () {
        it('should return the requested value', function () {
          expect(_.safeCall(TEST, 'one.two', undefined, undefined, undefined, true, true)).to.equal(L2);
        });
      });
      describe('given a non-empty, two-part, known first and second path, a known and not allowing nulls or undefineds,', function () {
        it('should return the requested value', function () {
          expect(_.safeCall(TEST, 'one.two', DEFAULT_VAL, undefined, undefined, false, false)).to.equal(L2);
        });
      });
      describe('given a non-empty, two-part, known first and second path, a known and not allowing nulls but allowing undefineds,', function () {
        it('should return the requested value', function () {
          expect(_.safeCall(TEST, 'one.two', DEFAULT_VAL, undefined, undefined, false, true)).to.equal(L2);
        });
      });
      describe('given a non-empty, two-part, known first and second path, a known default and allowing nulls but not undefineds,', function () {
        it('should return the requested value', function () {
          expect(_.safeCall(TEST, 'one.two', DEFAULT_VAL, undefined, undefined, true, false)).to.equal(L2);
        });
      });
      describe('given a non-empty, two-part, known first and second path, a known default and allowing nulls or undefineds,', function () {
        it('should return the requested value', function () {
          expect(_.safeCall(TEST, 'one.two', DEFAULT_VAL, undefined, undefined, true, true)).to.equal(L2);
        });
      });
      describe('given a non-empty, known two-part path to a valid primitive string object,', function () {
        it('should return the requested object', function () {
          expect(_.safeCall(TEST, 'one.test')).to.equal(t1);
        });
      });
      describe('given a non-empty, three-part, known first and second but unknown third path, an undefined default,', function () {
        it('should return the undefined', function () {
          expect(_.safeCall(TEST, 'one.two.unknown', undefined)).to.equal(undefined);
        });
      });
      describe('given a non-empty, three-part, known first and second but unknown third path, an undefined default, allowing nulls,', function () {
        it('should return the undefined', function () {
          expect(_.safeCall(TEST, 'one.two.unknown', undefined, undefined, undefined, true)).to.equal(undefined);
        });
      });
      describe('given a non-empty, three-part, known first and second but unknown third path, an undefined default, not allowing nulls,', function () {
        it('should return the undefined', function () {
          expect(_.safeCall(TEST, 'one.two.unknown', undefined, undefined, undefined, false)).to.equal(undefined);
        });
      });
      describe('given a non-empty, three-part, known first and second but unknown third path, a null default,', function () {
        it('should return the undefined', function () {
          expect(_.safeCall(TEST, 'one.two.unknown', null)).to.equal(undefined);
        });
      });
      describe('given a non-empty, three-part, known first and second but unknown third path, a null default, nulls allowed', function () {
        it('should return null', function () {
          expect(_.safeCall(TEST, 'one.two.unknown', null, undefined, undefined, true)).to.equal(null);
        });
      });
      describe('given a non-empty, three-part, known first and second but unknown third path, a null default, nulls not allowed', function () {
        it('should return the undefined', function () {
          expect(_.safeCall(TEST, 'one.two.unknown', null, undefined, undefined, false)).to.equal(undefined);
        });
      });
      describe('given a non-empty, three-part, known first and second but unknown third path, a null default, nulls allowed, undefineds not allowed', function () {
        it('should return null', function () {
          expect(_.safeCall(TEST, 'one.two.unknown', null, undefined, undefined, true, false)).to.equal(null);
        });
      });
      describe('given a non-empty, three-part, known first and second but unknown third path, a null default, nulls and undefineds allowed', function () {
        it('should return the undefined', function () {
          expect(_.safeCall(TEST, 'one.two.unknown', null, undefined, undefined, true, true)).to.equal(undefined);
        });
      });
      describe('given a non-empty, three-part, known first and second but unknown third path, a null default, nulls allowed, undefineds not allowed', function () {
        it('should return the undefined', function () {
          expect(_.safeCall(TEST, 'one.two.unknown', null, undefined, undefined, true, false)).to.equal(null);
        });
      });
      describe('given a non-empty, three-part, known first and second but unknown third path, a known default,', function () {
        it('should return the undefined', function () {
          expect(_.safeCall(TEST, 'one.two.unknown', DEFAULT_VAL)).to.equal(DEFAULT_VAL);
        });
      });
      describe('given a non-empty, three-part, known first and second but unknown third path, a known default and allowing nulls,', function () {
        it('should return the undefined', function () {
          expect(_.safeCall(TEST, 'one.two.unknown', DEFAULT_VAL, undefined, undefined, true)).to.equal(DEFAULT_VAL);
        });
      });
      describe('given a non-empty, three-part, known first and second but unknown third path, a known default and not allowing nulls,', function () {
        it('should return the undefined', function () {
          expect(_.safeCall(TEST, 'one.two.unknown', DEFAULT_VAL, undefined, undefined, false)).to.equal(DEFAULT_VAL);
        });
      });
      describe('given a non-empty, three-part, known first and second but unknown third path, a known default and allowing not allowingundefineds,', function () {
        it('should return the undefined', function () {
          expect(_.safeCall(TEST, 'one.two.unknown', DEFAULT_VAL, undefined, undefined, undefined, false)).to.equal(DEFAULT_VAL);
        });
      });
      describe('given a non-empty, three-part, known first and second but unknown third path, a known default and allowing undefineds,', function () {
        it('should return the undefined', function () {
          expect(_.safeCall(TEST, 'one.two.unknown', DEFAULT_VAL, undefined, undefined, undefined, true)).to.equal(undefined);
        });
      });
      describe('given a non-empty, three-part, known first and second but unknown third path, a known default and allowing nulls,', function () {
        it('should return null', function () {
          expect(_.safeCall(TEST, 'one.two.unknown', DEFAULT_VAL, undefined, undefined, true, undefined)).to.equal(DEFAULT_VAL);
        });
      });
      describe('given a non-empty, three-part, known first and second but unknown third path, a known default and not allowing nulls,', function () {
        it('should return null', function () {
          expect(_.safeCall(TEST, 'one.two.unknown', DEFAULT_VAL, undefined, undefined, false, undefined)).to.equal(DEFAULT_VAL);
        });
      });
      describe('given a non-empty, three-part, known first and second but unknown third path, a known default and allowing nulls and undefineds,', function () {
        it('should return null', function () {
          expect(_.safeCall(TEST, 'one.two.unknown', DEFAULT_VAL, undefined, undefined, true, true)).to.equal(undefined);
        });
      });
      describe('given a non-empty, three-part, known first and second but unknown third path, a known default and allowing nulls but not undefineds,', function () {
        it('should return null', function () {
          expect(_.safeCall(TEST, 'one.two.unknown', DEFAULT_VAL, undefined, undefined, true, false)).to.equal(DEFAULT_VAL);
        });
      });
      describe('given a non-empty, three-part, known first and second but unknown third path, a known default and not allowing nulls but allowing undefineds,', function () {
        it('should return null', function () {
          expect(_.safeCall(TEST, 'one.two.unknown', DEFAULT_VAL, undefined, undefined, false, true)).to.equal(undefined);
        });
      });
      describe('given a non-empty, three-part, known first and second but unknown third path, a known default and not allowing nulls or undefineds,', function () {
        it('should return null', function () {
          expect(_.safeCall(TEST, 'one.two.unknown', DEFAULT_VAL, undefined, undefined, false, false)).to.equal(DEFAULT_VAL);
        });
      });
      describe('given a non-empty, known three-part path to a valid object,', function () {
        it('should return the requested object', function () {
          expect(_.safeCall(TEST, 'one.two.three')).to.equal(L3);
        });
      });
      describe('given a non-empty, known three-part path to a valid primitive string object,', function () {
        it('should return the requested object', function () {
          expect(_.safeCall(TEST, 'one.two.test')).to.equal(t2);
        });
      });
      describe('given a non-empty, known three-part path to a valid object and a null default,', function () {
        it('should return the requested object', function () {
          expect(_.safeCall(TEST, 'one.two.three', null)).to.equal(L3);
        });
      });
      describe('given a non-empty, known three-part path to a valid primitive string object and a null default,', function () {
        it('should return the requested object', function () {
          expect(_.safeCall(TEST, 'one.two.test', null)).to.equal(t2);
        });
      });
      describe('given a non-empty, known three-part path to a valid object and a non-null default,', function () {
        it('should return the requested object', function () {
          expect(_.safeCall(TEST, 'one.two.three', DEFAULT_VAL)).to.equal(L3);
        });
      });
      describe('given a non-empty, known three-part path to a valid primitive string object and a non-null default,', function () {
        it('should return the requested object', function () {
          expect(_.safeCall(TEST, 'one.two.test', DEFAULT_VAL)).to.equal(t2);
        });
      });
      describe('given a non-empty, known four-part path to a valid object,', function () {
        it('should return the requested object', function () {
          expect(_.safeCall(TEST, 'one.two.three.four')).to.equal(t4);
        });
      });
      describe('given a non-empty, known four-part path to a valid object,', function () {
        it('should return the requested object', function () {
          expect(_.safeCall(TEST, 'one.two.three.four')).to.equal(t4);
        });
      });
      describe('given a non-empty, known four-part path to a valid truth,', function () {
        it('should return true', function () {
          expect(_.safeCall(TEST, 'one.two.three.truth')).to.equal(true);
        });
      });
      describe('given a non-empty, known four-part path to a valid falseness,', function () {
        it('should return false', function () {
          expect(_.safeCall(TEST, 'one.two.three.falseness')).to.equal(false);
        });
      });
      describe('given a non-empty, known four-part path to a valid number,', function () {
        it('should return true', function () {
          expect(_.safeCall(TEST, 'one.two.three.number')).to.equal(23);
        });
      });
      describe('given a non-empty, known four-part path to a valid string,', function () {
        it('should return the string', function () {
          expect(_.safeCall(TEST, 'one.two.three.aString')).to.equal('aString');
        });
      });
      describe('given a non-empty, known four-part path to a valid object, null default,', function () {
        it('should return the requested object', function () {
          expect(_.safeCall(TEST, 'one.two.three.four', null)).to.equal(t4);
        });
      });
      describe('given a non-empty, known four-part path to a valid truth, null default,', function () {
        it('should return true', function () {
          expect(_.safeCall(TEST, 'one.two.three.truth', null)).to.equal(true);
        });
      });
      describe('given a non-empty, known four-part path to a valid falseness, null default,', function () {
        it('should return false', function () {
          expect(_.safeCall(TEST, 'one.two.three.falseness', null)).to.equal(false);
        });
      });
      describe('given a non-empty, known four-part path to a valid number, null default,', function () {
        it('should return true', function () {
          expect(_.safeCall(TEST, 'one.two.three.number', null)).to.equal(23);
        });
      });
      describe('given a non-empty, known four-part path to a valid string, null default,', function () {
        it('should return the string', function () {
          expect(_.safeCall(TEST, 'one.two.three.aString', null)).to.equal('aString');
        });
      });
      describe('given a non-empty, known four-part path to a valid object, non-null default,', function () {
        it('should return the requested object', function () {
          expect(_.safeCall(TEST, 'one.two.three.four', DEFAULT_VAL)).to.equal(t4);
        });
      });
      describe('given a non-empty, known four-part path to a valid truth, non-null default,', function () {
        it('should return true', function () {
          expect(_.safeCall(TEST, 'one.two.three.truth', DEFAULT_VAL)).to.equal(true);
        });
      });
      describe('given a non-empty, known four-part path to a valid falseness, non-null default,', function () {
        it('should return false', function () {
          expect(_.safeCall(TEST, 'one.two.three.falseness', DEFAULT_VAL)).to.equal(false);
        });
      });
      describe('given a non-empty, known four-part path to a valid number, non-null default,', function () {
        it('should return true', function () {
          expect(_.safeCall(TEST, 'one.two.three.number', DEFAULT_VAL)).to.equal(23);
        });
      });
      describe('given a non-empty, known four-part path to a valid string, non-null default,', function () {
        it('should return the string', function () {
          expect(_.safeCall(TEST, 'one.two.three.aString', DEFAULT_VAL)).to.equal('aString');
        });
      });
    });

    describe('given a real callback function', function() {
      describe('given no other parameters,', function () {
        it('should return TEST', function () {
          expect(_.safeCall(TEST, undefined, undefined, cbf)).to.equal(TEST);
        });
      });
      describe('given an undefined path, default value, allowsNull flag and allowing for undefined results,', function () {
        it('should return TEST', function () {
          expect(_.safeCall(TEST, undefined, undefined, cbf, undefined, undefined, true)).to.equal(TEST);
        });
      });
      describe('given a null path,', function () {
        it('should return TEST', function () {
          expect(_.safeCall(TEST, null, undefined, cbf)).to.equal(TEST);
        });
      });
      describe('given a null path and null default,', function () {
        it('should return TEST', function () {
          expect(_.safeCall(TEST, null, null, cbf)).to.equal(TEST);
        });
      });
      describe('given a null path and null default and allowing nulls,', function () {
        it('should return TEST', function () {
          expect(_.safeCall(TEST, null, null, cbf, undefined, true)).to.equal(TEST);
        });
      });
      describe('given a null path and non-null default,', function () {
        it('should return the TEST', function () {
          expect(_.safeCall(TEST, null, DEFAULT_VAL, cbf)).to.equal(TEST);
        });
      });
      describe('given a non-null, empty path and no default,', function () {
        it('should return TEST', function () {
          expect(_.safeCall(TEST, '', undefined, cbf)).to.equal(TEST);
        });
      });
      describe('given a non-null, empty path and null default,', function () {
        it('should return TEST', function () {
          expect(_.safeCall(TEST, '', null, cbf)).to.equal(TEST);
        });
      });
      describe('given a non-null, empty path and non-null default,', function () {
        it('should return TEST', function () {
          expect(_.safeCall(TEST, '', DEFAULT_VAL, cbf)).to.equal(TEST);
        });
      });
      describe('given a non-null, empty path, a non-null default and allowing nulls,', function () {
        it('should return the TEST', function () {
          expect(_.safeCall(TEST, '', DEFAULT_VAL, cbf, undefined, true)).to.equal(TEST);
        });
      });
      describe('given a non-null, empty path, a non-null default and allowing nulls and undefineds,', function () {
        it('should return TEST', function () {
          expect(_.safeCall(TEST, '', DEFAULT_VAL, cbf, undefined, true, true)).to.equal(TEST);
        });
      });
      describe('given a non-null, empty path, a non-null default and not allowing nulls but allowing undefineds,', function () {
        it('should return TEST', function () {
          expect(_.safeCall(TEST, '', DEFAULT_VAL, cbf, undefined, false, true)).to.equal(TEST);
        });
      });
      describe('given a non-empty, unknown path,', function () {
        it('should return undefined', function () {
          expect(_.safeCall(TEST, 'unknown', undefined, cbf)).to.equal(undefined);
        });
      });
      describe('given a non-empty, unknown path, a non-null default,', function () {
        it('should return the default', function () {
          expect(_.safeCall(TEST, 'unknown', DEFAULT_VAL, cbf)).to.equal(DEFAULT_VAL);
        });
      });
      describe('given a non-empty, unknown path, a non-null default and allowing nulls,', function () {
        it('should return the default', function () {
          expect(_.safeCall(TEST, 'unknown', DEFAULT_VAL, cbf, undefined, true)).to.equal(DEFAULT_VAL);
        });
      });
      describe('given a non-empty, unknown path, a non-null default and allowing nulls and undefineds,', function () {
        it('should return UNDEF', function () {
          expect(_.safeCall(TEST, 'unknown', DEFAULT_VAL, cbf, undefined, true, true)).to.equal(UNDEF);
        });
      });
      describe('given a non-empty, unknown path, an undefined and allowing nulls and undefineds,', function () {
        it('should return UNDEF', function () {
          expect(_.safeCall(TEST, 'unknown', undefined, cbf, undefined, true, true)).to.equal(UNDEF);
        });
      });
      describe('given a non-empty, unknown path, an undefined and allowing nulls and undefineds,', function () {
        it('should return UNDEF', function () {
          expect(_.safeCall(TEST, 'unknown', undefined, cbf, undefined, true, true)).to.equal(UNDEF);
        });
      });
      describe('given a non-empty, unknown path, an undefined and allowing undefineds,', function () {
        it('should return UNDEF', function () {
          expect(_.safeCall(TEST, 'unknown', undefined, cbf, undefined, false, true)).to.equal(UNDEF);
        });
      });
      describe('given a non-empty, known path to an object,', function () {
        it('should return the requested value', function () {
          expect(_.safeCall(TEST, 'one', undefined, cbf)).to.equal(L1);
        });
      });
      describe('given a non-empty, known path to a primitive,', function () {
        it('should return the requested primitive value', function () {
          expect(_.safeCall(TEST, 'test', undefined, cbf)).to.equal(t);
        });
      });
      describe('given a non-empty, two-part, an undefined and allowing undefineds,', function () {
        it('should return UNDEF', function () {
          expect(_.safeCall(TEST, 'unknown.unknown2', undefined, cbf, undefined, false, true)).to.equal(UNDEF);
        });
      });
      describe('given a non-empty, two-part, first known and second unknown path, an undefined default and allowing undefineds,', function () {
        it('should return UNDEF', function () {
          expect(_.safeCall(TEST, 'one.unknown', undefined, cbf, undefined, false, true)).to.equal(UNDEF);
        });
      });
      describe('given a non-empty, two-part, first known and second unknown path, an undefined default and allowing undefineds,', function () {
        it('should return UNDEF', function () {
          expect(_.safeCall(TEST, 'one.unknown', DEFAULT_VAL, cbf, undefined, false, true)).to.equal(UNDEF);
        });
      });
      describe('given a non-empty, two-part, first known and second unknown path, an undefined default and not allowing undefineds,', function () {
        it('should return the default', function () {
          expect(_.safeCall(TEST, 'one.unknown', DEFAULT_VAL, cbf, undefined, false, false)).to.equal(DEFAULT_VAL);
        });
      });
      describe('given a non-empty, two-part, known first and second path,', function () {
        it('should return the requested value', function () {
          expect(_.safeCall(TEST, 'one.two', DEFAULT_VAL)).to.equal(L2);
        });
      });
      describe('given a non-empty, two-part, known first and second path, an undefined default and not allowing nulls or undefineds,', function () {
        it('should return the requested value', function () {
          expect(_.safeCall(TEST, 'one.two', undefined, cbf, undefined, false, false)).to.equal(L2);
        });
      });
      describe('given a non-empty, two-part, known first and second path, an undefined default and not allowing nulls but allowing undefineds,', function () {
        it('should return the requested value', function () {
          expect(_.safeCall(TEST, 'one.two', undefined, cbf, undefined, false, true)).to.equal(L2);
        });
      });
      describe('given a non-empty, two-part, known first and second path, an undefined default and allowing nulls but not undefineds,', function () {
        it('should return the requested value', function () {
          expect(_.safeCall(TEST, 'one.two', undefined, cbf, undefined, true, false)).to.equal(L2);
        });
      });
      describe('given a non-empty, two-part, known first and second path, an undefined default and allowing nulls or undefineds,', function () {
        it('should return the requested value', function () {
          expect(_.safeCall(TEST, 'one.two', undefined, cbf, undefined, true, true)).to.equal(L2);
        });
      });
      describe('given a non-empty, two-part, known first and second path, a known and not allowing nulls or undefineds,', function () {
        it('should return the requested value', function () {
          expect(_.safeCall(TEST, 'one.two', DEFAULT_VAL, cbf, undefined, false, false)).to.equal(L2);
        });
      });
      describe('given a non-empty, two-part, known first and second path, a known and not allowing nulls but allowing undefineds,', function () {
        it('should return the requested value', function () {
          expect(_.safeCall(TEST, 'one.two', DEFAULT_VAL, cbf, undefined, false, true)).to.equal(L2);
        });
      });
      describe('given a non-empty, two-part, known first and second path, a known default and allowing nulls but not undefineds,', function () {
        it('should return the requested value', function () {
          expect(_.safeCall(TEST, 'one.two', DEFAULT_VAL, cbf, undefined, true, false)).to.equal(L2);
        });
      });
      describe('given a non-empty, two-part, known first and second path, a known default and allowing nulls or undefineds,', function () {
        it('should return the requested value', function () {
          expect(_.safeCall(TEST, 'one.two', DEFAULT_VAL, cbf, undefined, true, true)).to.equal(L2);
        });
      });
      describe('given a non-empty, known two-part path to a valid primitive string object,', function () {
        it('should return the requested object', function () {
          expect(_.safeCall(TEST, 'one.test', undefined, cbf)).to.equal(t1);
        });
      });
      describe('given a non-empty, three-part, known first and second but unknown third path, an undefined default,', function () {
        it('should return the undefined', function () {
          expect(_.safeCall(TEST, 'one.two.unknown', undefined, cbf)).to.equal(undefined);
        });
      });
      describe('given a non-empty, three-part, known first and second but unknown third path, an undefined default, allowing nulls,', function () {
        it('should return the undefined', function () {
          expect(_.safeCall(TEST, 'one.two.unknown', undefined, cbf, undefined, true)).to.equal(undefined);
        });
      });
      describe('given a non-empty, three-part, known first and second but unknown third path, an undefined default, not allowing nulls,', function () {
        it('should return the undefined', function () {
          expect(_.safeCall(TEST, 'one.two.unknown', undefined, cbf, undefined, false)).to.equal(undefined);
        });
      });
      describe('given a non-empty, three-part, known first and second but unknown third path, a null default,', function () {
        it('should return the undefined', function () {
          expect(_.safeCall(TEST, 'one.two.unknown', null, cbf)).to.equal(undefined);
        });
      });
      describe('given a non-empty, three-part, known first and second but unknown third path, a null default, nulls allowed', function () {
        it('should return NULL', function () {
          expect(_.safeCall(TEST, 'one.two.unknown', null, cbf, undefined, true)).to.equal(NULL);
        });
      });
      describe('given a non-empty, three-part, known first and second but unknown third path, a null default, nulls not allowed', function () {
        it('should return the undefined', function () {
          expect(_.safeCall(TEST, 'one.two.unknown', null, cbf, undefined, false)).to.equal(undefined);
        });
      });
      describe('given a non-empty, three-part, known first and second but unknown third path, a null default, nulls allowed, undefineds not allowed', function () {
        it('should return NULL', function () {
          expect(_.safeCall(TEST, 'one.two.unknown', null, cbf, undefined, true, false)).to.equal(NULL);
        });
      });
      describe('given a non-empty, three-part, known first and second but unknown third path, a null default, nulls and undefineds allowed', function () {
        it('should return UNDEF', function () {
          expect(_.safeCall(TEST, 'one.two.unknown', null, cbf, undefined, true, true)).to.equal(UNDEF);
        });
      });
      describe('given a non-empty, three-part, known first and second but unknown third path, a null default, nulls allowed, undefineds not allowed', function () {
        it('should return NULL', function () {
          expect(_.safeCall(TEST, 'one.two.unknown', null, cbf, undefined, true, false)).to.equal(NULL);
        });
      });
      describe('given a non-empty, three-part, known first and second but unknown third path, a known default,', function () {
        it('should return the undefined', function () {
          expect(_.safeCall(TEST, 'one.two.unknown', DEFAULT_VAL, cbf)).to.equal(DEFAULT_VAL);
        });
      });
      describe('given a non-empty, three-part, known first and second but unknown third path, a known default and allowing nulls,', function () {
        it('should return the undefined', function () {
          expect(_.safeCall(TEST, 'one.two.unknown', DEFAULT_VAL, cbf, undefined, true)).to.equal(DEFAULT_VAL);
        });
      });
      describe('given a non-empty, three-part, known first and second but unknown third path, a known default and not allowing nulls,', function () {
        it('should return the undefined', function () {
          expect(_.safeCall(TEST, 'one.two.unknown', DEFAULT_VAL, cbf, undefined, false)).to.equal(DEFAULT_VAL);
        });
      });
      describe('given a non-empty, three-part, known first and second but unknown third path, a known default and allowing not allowingundefineds,', function () {
        it('should return the undefined', function () {
          expect(_.safeCall(TEST, 'one.two.unknown', DEFAULT_VAL, cbf, undefined, undefined, false)).to.equal(DEFAULT_VAL);
        });
      });
      describe('given a non-empty, three-part, known first and second but unknown third path, a known default and allowing undefineds,', function () {
        it('should return UNDEF', function () {
          expect(_.safeCall(TEST, 'one.two.unknown', DEFAULT_VAL, cbf, undefined, undefined, true)).to.equal(UNDEF);
        });
      });
      describe('given a non-empty, three-part, known first and second but unknown third path, a known default and allowing nulls,', function () {
        it('should return null', function () {
          expect(_.safeCall(TEST, 'one.two.unknown', DEFAULT_VAL, cbf, undefined, true, undefined)).to.equal(DEFAULT_VAL);
        });
      });
      describe('given a non-empty, three-part, known first and second but unknown third path, a known default and not allowing nulls,', function () {
        it('should return null', function () {
          expect(_.safeCall(TEST, 'one.two.unknown', DEFAULT_VAL, cbf, undefined, false, undefined)).to.equal(DEFAULT_VAL);
        });
      });
      describe('given a non-empty, three-part, known first and second but unknown third path, a known default and allowing nulls and undefineds,', function () {
        it('should return UNDEF', function () {
          expect(_.safeCall(TEST, 'one.two.unknown', DEFAULT_VAL, cbf, undefined, true, true)).to.equal(UNDEF);
        });
      });
      describe('given a non-empty, three-part, known first and second but unknown third path, a known default and allowing nulls but not undefineds,', function () {
        it('should return null', function () {
          expect(_.safeCall(TEST, 'one.two.unknown', DEFAULT_VAL, cbf, undefined, true, false)).to.equal(DEFAULT_VAL);
        });
      });
      describe('given a non-empty, three-part, known first and second but unknown third path, a known default and not allowing nulls but allowing undefineds,', function () {
        it('should return UNDEF', function () {
          expect(_.safeCall(TEST, 'one.two.unknown', DEFAULT_VAL, cbf, undefined, false, true)).to.equal(UNDEF);
        });
      });
      describe('given a non-empty, three-part, known first and second but unknown third path, a known default and not allowing nulls or undefineds,', function () {
        it('should return null', function () {
          expect(_.safeCall(TEST, 'one.two.unknown', DEFAULT_VAL, cbf, undefined, false, false)).to.equal(DEFAULT_VAL);
        });
      });
      describe('given a non-empty, known three-part path to a valid object,', function () {
        it('should return the requested object', function () {
          expect(_.safeCall(TEST, 'one.two.three', undefined, cbf)).to.equal(L3);
        });
      });
      describe('given a non-empty, known three-part path to a valid primitive string object,', function () {
        it('should return the requested object', function () {
          expect(_.safeCall(TEST, 'one.two.test', undefined, cbf)).to.equal(t2);
        });
      });
      describe('given a non-empty, known three-part path to a valid object and a null default,', function () {
        it('should return the requested object', function () {
          expect(_.safeCall(TEST, 'one.two.three', null, undefined, cbf)).to.equal(L3);
        });
      });
      describe('given a non-empty, known three-part path to a valid primitive string object and a null default,', function () {
        it('should return the requested object', function () {
          expect(_.safeCall(TEST, 'one.two.test', null, cbf)).to.equal(t2);
        });
      });
      describe('given a non-empty, known three-part path to a valid object and a non-null default,', function () {
        it('should return the requested object', function () {
          expect(_.safeCall(TEST, 'one.two.three', DEFAULT_VAL, cbf)).to.equal(L3);
        });
      });
      describe('given a non-empty, known three-part path to a valid primitive string object and a non-null default,', function () {
        it('should return the requested object', function () {
          expect(_.safeCall(TEST, 'one.two.test', DEFAULT_VAL, cbf)).to.equal(t2);
        });
      });
      describe('given a non-empty, known four-part path to a valid object,', function () {
        it('should return the requested object', function () {
          expect(_.safeCall(TEST, 'one.two.three.four', undefined, cbf)).to.equal(t4);
        });
      });
      describe('given a non-empty, known four-part path to a valid object,', function () {
        it('should return the requested object', function () {
          expect(_.safeCall(TEST, 'one.two.three.four', undefined, cbf)).to.equal(t4);
        });
      });
      describe('given a non-empty, known four-part path to a valid truth,', function () {
        it('should return true', function () {
          expect(_.safeCall(TEST, 'one.two.three.truth', undefined, cbf)).to.equal(true);
        });
      });
      describe('given a non-empty, known four-part path to a valid falseness,', function () {
        it('should return false', function () {
          expect(_.safeCall(TEST, 'one.two.three.falseness', undefined, cbf)).to.equal(false);
        });
      });
      describe('given a non-empty, known four-part path to a valid number,', function () {
        it('should return true', function () {
          expect(_.safeCall(TEST, 'one.two.three.number', undefined, cbf)).to.equal(23);
        });
      });
      describe('given a non-empty, known four-part path to a valid string,', function () {
        it('should return the string', function () {
          expect(_.safeCall(TEST, 'one.two.three.aString', undefined, cbf)).to.equal('aString');
        });
      });
      describe('given a non-empty, known four-part path to a valid object, null default,', function () {
        it('should return the requested object', function () {
          expect(_.safeCall(TEST, 'one.two.three.four', null, cbf)).to.equal(t4);
        });
      });
      describe('given a non-empty, known four-part path to a valid truth, null default,', function () {
        it('should return true', function () {
          expect(_.safeCall(TEST, 'one.two.three.truth', null, cbf)).to.equal(true);
        });
      });
      describe('given a non-empty, known four-part path to a valid falseness, null default,', function () {
        it('should return false', function () {
          expect(_.safeCall(TEST, 'one.two.three.falseness', null, cbf)).to.equal(false);
        });
      });
      describe('given a non-empty, known four-part path to a valid number, null default,', function () {
        it('should return true', function () {
          expect(_.safeCall(TEST, 'one.two.three.number', null, cbf)).to.equal(23);
        });
      });
      describe('given a non-empty, known four-part path to a valid string, null default,', function () {
        it('should return the string', function () {
          expect(_.safeCall(TEST, 'one.two.three.aString', null, cbf)).to.equal('aString');
        });
      });
      describe('given a non-empty, known four-part path to a valid object, non-null default,', function () {
        it('should return the requested object', function () {
          expect(_.safeCall(TEST, 'one.two.three.four', DEFAULT_VAL, cbf)).to.equal(t4);
        });
      });
      describe('given a non-empty, known four-part path to a valid truth, non-null default,', function () {
        it('should return true', function () {
          expect(_.safeCall(TEST, 'one.two.three.truth', DEFAULT_VAL, cbf)).to.equal(true);
        });
      });
      describe('given a non-empty, known four-part path to a valid falseness, non-null default,', function () {
        it('should return false', function () {
          expect(_.safeCall(TEST, 'one.two.three.falseness', DEFAULT_VAL, cbf)).to.equal(false);
        });
      });
      describe('given a non-empty, known four-part path to a valid number, non-null default,', function () {
        it('should return true', function () {
          expect(_.safeCall(TEST, 'one.two.three.number', DEFAULT_VAL, cbf)).to.equal(23);
        });
      });
      describe('given a non-empty, known four-part path to a valid string, non-null default,', function () {
        it('should return the string', function () {
          expect(_.safeCall(TEST, 'one.two.three.aString', DEFAULT_VAL, cbf)).to.equal('aString');
        });
      });

      describe('given a non-empty, invalid four-part path, non-null default, non-null return', function(){
        it('should return the default', function(){
          expect(_.safeCall(TEST, 'one.two.three.unknown', DEFAULT_VAL, cbf, undefined, undefined, undefined, DEFAULT_RET)).to.equal(DEFAULT_VAL);
        });
      });
      describe('given a non-empty, invalid four-part path, non-null default, allow undefined, non-null return', function(){
        it('should return UNDEF', function(){
          expect(_.safeCall(TEST, 'one.two.three.unknown', DEFAULT_VAL, cbf, undefined, undefined, true, DEFAULT_RET)).to.equal(UNDEF);
        });
      });
      describe('given a non-empty, invalid four-part path, non-null default, allow undefined, non-null return, do not allow undefined result', function(){
        it('should return UNDEF', function(){
          expect(_.safeCall(TEST, 'one.two.three.unknown', DEFAULT_VAL, cbf, undefined, undefined, true, DEFAULT_RET, undefined, false)).to.equal(UNDEF);
        });
      });
      describe('given a non-empty, invalid four-part path, a null-producing default, do not allow undefined, non-null return, do not allow null result', function(){
        it('should return default return value', function(){
          expect(_.safeCall(TEST, 'one.two.three.unknown', NULL_PRODUCER, cbf, undefined, undefined, undefined, DEFAULT_RET, false)).to.equal(DEFAULT_RET);
        });
      });
      describe('given a non-empty, invalid four-part path, a udef-producing default, do not allow undefined, non-null return, do not allow udef result', function(){
        it('should return default return value', function(){
          expect(_.safeCall(TEST, 'one.two.three.unknown', UNDEF_PRODUCER, cbf, undefined, undefined, undefined, DEFAULT_RET, undefined, false)).to.equal(DEFAULT_RET);
        });
      });

      describe('given a non-empty, invalid four-part path, a udef-producing default, do not allow undefined, non-null return, do not allow udef or null result', function(){
        it('should return default return value', function(){
          expect(_.safeCall(TEST, 'one.two.three.unknown', NULL_PRODUCER, cbf, undefined, undefined, undefined, DEFAULT_RET, false, false)).to.equal(DEFAULT_RET);
        });
      });

      describe('given a non-empty, invalid four-part path, a udef-producing default, do not allow undefined, non-null return, do not allow udef or null result', function(){
        it('should return default return value', function(){
          expect(_.safeCall(TEST, 'one.two.three.unknown', UNDEF_PRODUCER, cbf, undefined, undefined, undefined, DEFAULT_RET, false, false)).to.equal(DEFAULT_RET);
        });
      });

    });
  });

});