/**
 * Created by peter.pavlovich on 6/9/15.
 */

var chai = require('chai');

var owl = /* This file is part of OWL JavaScript Utilities.

 OWL JavaScript Utilities is free software: you can redistribute it and/or 
 modify it under the terms of the GNU Lesser General Public License
 as published by the Free Software Foundation, either version 3 of
 the License, or (at your option) any later version.

 OWL JavaScript Utilities is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Lesser General Public License for more details.

 You should have received a copy of the GNU Lesser General Public 
 License along with OWL JavaScript Utilities.  If not, see 
 <http://www.gnu.org/licenses/>.
 */

  owl = (function() {

    // the re-usable constructor function used by clone().
    function Clone() {}

    // clone objects, skip other types.
    function clone(target) {
      if ( typeof target == 'object' ) {
        Clone.prototype = target;
        return new Clone();
      } else {
        return target;
      }
    }


    // Shallow Copy 
    function copy(target) {
      if (typeof target !== 'object' ) {
        return target;  // non-object have value sematics, so target is already a copy.
      } else {
        var value = target.valueOf();
        if (target != value) {
          // the object is a standard object wrapper for a native type, say String.
          // we can make a copy by instantiating a new object around the value.
          return new target.constructor(value);
        } else {
          // ok, we have a normal object. If possible, we'll clone the original's prototype 
          // (not the original) to get an empty object with the same prototype chain as
          // the original.  If just copy the instance properties.  Otherwise, we have to 
          // copy the whole thing, property-by-property.
          if ( target instanceof target.constructor && target.constructor !== Object ) {
            var c = clone(target.constructor.prototype);

            // give the copy all the instance properties of target.  It has the same
            // prototype as target, so inherited properties are already there.
            for ( var property in target) {
              if (target.hasOwnProperty(property)) {
                c[property] = target[property];
              }
            }
          } else {
            var c = {};
            for ( var property in target ) c[property] = target[property];
          }

          return c;
        }
      }
    }

    // Deep Copy
    var deepCopiers = [];

    function DeepCopier(config) {
      for ( var key in config ) this[key] = config[key];
    }
    DeepCopier.prototype = {
      constructor: DeepCopier,

      // determines if this DeepCopier can handle the given object.
      canCopy: function(source) { return false; },

      // starts the deep copying process by creating the copy object.  You
      // can initialize any properties you want, but you can't call recursively
      // into the DeeopCopyAlgorithm.
      create: function(source) { },

      // Completes the deep copy of the source object by populating any properties
      // that need to be recursively deep copied.  You can do this by using the
      // provided deepCopyAlgorithm instance's deepCopy() method.  This will handle
      // cyclic references for objects already deepCopied, including the source object
      // itself.  The "result" passed in is the object returned from create().
      populate: function(deepCopyAlgorithm, source, result) {}
    };

    function DeepCopyAlgorithm() {
      // copiedObjects keeps track of objects already copied by this
      // deepCopy operation, so we can correctly handle cyclic references.
      this.copiedObjects = [];
      thisPass = this;
      this.recursiveDeepCopy = function(source) {
        return thisPass.deepCopy(source);
      }
      this.depth = 0;
    }
    DeepCopyAlgorithm.prototype = {
      constructor: DeepCopyAlgorithm,

      maxDepth: 256,

      // add an object to the cache.  No attempt is made to filter duplicates;
      // we always check getCachedResult() before calling it.
      cacheResult: function(source, result) {
        this.copiedObjects.push([source, result]);
      },

      // Returns the cached copy of a given object, or undefined if it's an
      // object we haven't seen before.
      getCachedResult: function(source) {
        var copiedObjects = this.copiedObjects;
        var length = copiedObjects.length;
        for ( var i=0; i<length; i++ ) {
          if ( copiedObjects[i][0] === source ) {
            return copiedObjects[i][1];
          }
        }
        return undefined;
      },

      // deepCopy handles the simple cases itself: non-objects and object's we've seen before.
      // For complex cases, it first identifies an appropriate DeepCopier, then calls
      // applyDeepCopier() to delegate the details of copying the object to that DeepCopier.
      deepCopy: function(source) {
        // null is a special case: it's the only value of type 'object' without properties.
        if ( source === null ) return null;

        // All non-objects use value semantics and don't need explict copying.
        if ( typeof source !== 'object' ) return source;

        var cachedResult = this.getCachedResult(source);

        // we've already seen this object during this deep copy operation
        // so can immediately return the result.  This preserves the cyclic
        // reference structure and protects us from infinite recursion.
        if ( cachedResult ) return cachedResult;

        // objects may need special handling depending on their class.  There is
        // a class of handlers call "DeepCopiers"  that know how to copy certain
        // objects.  There is also a final, generic deep copier that can handle any object.
        for ( var i=0; i<deepCopiers.length; i++ ) {
          var deepCopier = deepCopiers[i];
          if ( deepCopier.canCopy(source) ) {
            return this.applyDeepCopier(deepCopier, source);
          }
        }
        // the generic copier can handle anything, so we should never reach this line.
        throw new Error("no DeepCopier is able to copy " + source);
      },

      // once we've identified which DeepCopier to use, we need to call it in a very
      // particular order: create, cache, populate.  This is the key to detecting cycles.
      // We also keep track of recursion depth when calling the potentially recursive
      // populate(): this is a fail-fast to prevent an infinite loop from consuming all
      // available memory and crashing or slowing down the browser.
      applyDeepCopier: function(deepCopier, source) {
        // Start by creating a stub object that represents the copy.
        var result = deepCopier.create(source);

        // we now know the deep copy of source should always be result, so if we encounter
        // source again during this deep copy we can immediately use result instead of
        // descending into it recursively.  
        this.cacheResult(source, result);

        // only DeepCopier::populate() can recursively deep copy.  So, to keep track
        // of recursion depth, we increment this shared counter before calling it,
        // and decrement it afterwards.
        this.depth++;
        if ( this.depth > this.maxDepth ) {
          throw new Error("Exceeded max recursion depth in deep copy.");
        }

        // It's now safe to let the deepCopier recursively deep copy its properties.
        deepCopier.populate(this.recursiveDeepCopy, source, result);

        this.depth--;

        return result;
      }
    };

    // entry point for deep copy.
    //   source is the object to be deep copied.
    //   maxDepth is an optional recursion limit. Defaults to 256.
    function deepCopy(source, maxDepth) {
      var deepCopyAlgorithm = new DeepCopyAlgorithm();
      if ( maxDepth ) deepCopyAlgorithm.maxDepth = maxDepth;
      return deepCopyAlgorithm.deepCopy(source);
    }

    // publicly expose the DeepCopier class.
    deepCopy.DeepCopier = DeepCopier;

    // publicly expose the list of deepCopiers.
    deepCopy.deepCopiers = deepCopiers;

    // make deepCopy() extensible by allowing others to 
    // register their own custom DeepCopiers.
    deepCopy.register = function(deepCopier) {
      if ( !(deepCopier instanceof DeepCopier) ) {
        deepCopier = new DeepCopier(deepCopier);
      }
      deepCopiers.unshift(deepCopier);
    }

    // Generic Object copier
    // the ultimate fallback DeepCopier, which tries to handle the generic case.  This
    // should work for base Objects and many user-defined classes.
    deepCopy.register({
      canCopy: function(source) { return true; },

      create: function(source) {
        if ( source instanceof source.constructor ) {
          return clone(source.constructor.prototype);
        } else {
          return {};
        }
      },

      populate: function(deepCopy, source, result) {
        for ( var key in source ) {
          if ( source.hasOwnProperty(key) ) {
            result[key] = deepCopy(source[key]);
          }
        }
        return result;
      }
    });

    // Array copier
    deepCopy.register({
      canCopy: function(source) {
        return ( source instanceof Array );
      },

      create: function(source) {
        return new source.constructor();
      },

      populate: function(deepCopy, source, result) {
        for ( var i=0; i<source.length; i++) {
          result.push( deepCopy(source[i]) );
        }
        return result;
      }
    });

    // Date copier
    deepCopy.register({
      canCopy: function(source) {
        return ( source instanceof Date );
      },

      create: function(source) {
        return new Date(source);
      }
    });

    // HTML DOM Node

    // utility function to detect Nodes.  In particular, we're looking
    // for the cloneNode method.  The global document is also defined to
    // be a Node, but is a special case in many ways.
    function isNode(source) {
      if(typeof window == 'undefined'){
        return false;
      }

      if ( window.Node ) {
        return source instanceof Node;
      } else {
        // the document is a special Node and doesn't have many of
        // the common properties so we use an identity check instead.
        if ( source === document ) return true;
        return (
          typeof source.nodeType === 'number' &&
          source.attributes &&
          source.childNodes &&
          source.cloneNode
        );
      }
    }

    // Node copier
    deepCopy.register({
      canCopy: function(source) { return isNode(source); },

      create: function(source) {
        // there can only be one (document).
        if ( source === document ) return document;

        // start with a shallow copy.  We'll handle the deep copy of
        // its children ourselves.
        return source.cloneNode(false);
      },

      populate: function(deepCopy, source, result) {
        // we're not copying the global document, so don't have to populate it either.
        if ( source === document ) return document;

        // if this Node has children, deep copy them one-by-one.
        if ( source.childNodes && source.childNodes.length ) {
          for ( var i=0; i<source.childNodes.length; i++ ) {
            var childCopy = deepCopy(source.childNodes[i]);
            result.appendChild(childCopy);
          }
        }
      }
    });

    var holder = module ? module : {};

    holder.exports = {
      DeepCopyAlgorithm: DeepCopyAlgorithm,
      copy: copy,
      clone: clone,
      deepCopy: deepCopy
    };

    return holder.exports;
  })();


var assert = chai.assert,
  expect = chai.expect,
  should = chai.should();

_ = require('lodash');

require('../../index');

var unwrapStringOrNumber = function unwrapStringOrNumber(obj) {
  return (obj instanceof Number || obj instanceof String
    ? obj.valueOf()
    : obj);
};

var areEquivalent = function areEquivalent(a, b) {
  a = unwrapStringOrNumber(a);
  b = unwrapStringOrNumber(b);
  if (a === b) return true; //e.g. a and b both null
  if (a === null || b === null || typeof (a) !== typeof (b)) return false;
  if (a instanceof Date)
    return b instanceof Date && a.valueOf() === b.valueOf();
  if (typeof (a) !== "object")
    return a == b; //for boolean, number, string, xml

  var newA = (a.areEquivalent_Eq_91_2_34 === undefined),
    newB = (b.areEquivalent_Eq_91_2_34 === undefined);
  try {
    if (newA) a.areEquivalent_Eq_91_2_34 = [];
    else if (a.areEquivalent_Eq_91_2_34.some(
        function (other) { return other === b; })) return true;
    if (newB) b.areEquivalent_Eq_91_2_34 = [];
    else if (b.areEquivalent_Eq_91_2_34.some(
        function (other) { return other === a; })) return true;
    a.areEquivalent_Eq_91_2_34.push(b);
    b.areEquivalent_Eq_91_2_34.push(a);

    var tmp = {};
    for (var prop in a)
      if(prop != "areEquivalent_Eq_91_2_34")
        tmp[prop] = null;
    for (var prop in b)
      if (prop != "areEquivalent_Eq_91_2_34")
        tmp[prop] = null;

    for (var prop in tmp)
      if (!areEquivalent(a[prop], b[prop]))
        return false;
    return true;
  } finally {
    if (newA) delete a.areEquivalent_Eq_91_2_34;
    if (newB) delete b.areEquivalent_Eq_91_2_34;
  }
};

describe('The safeSet utility function,', function() {

  var s, e, u, n, no, ns, o, ne, nu, nn, DEFAULT_VAL, TEST_VAL, NON_NULL;

  beforeEach(function(){
    s = 'aString';
    e = {};
    u = undefined;
    n = null;
    no = {aaa: {aaaa: ns}};
    ns = 'a nested string';
    o = {aa: no, bb: ns};
    ne = {};
    nu = undefined;
    nn = null;
    DEFAULT_VAL = {a: o, e: e, u: u, n: n, s: s};
    TEST_VAL = '___MyTeSt_vAlUe___';
    NON_NULL = "A nice test string";
  });

  it('should be a function', function () {
    expect(typeof _.safeSet).to.equal("function");
  });

 // safeSet(obj, path, value, overwrite)

  describe('given a null input object,', function () {
    describe('given no other parameters,', function () {
      it('should return empty object', function () {
        var res = areEquivalent(_.safeSet(null), e);
        expect(res).to.equal(true);
      });
    });
    describe('empty path,', function () {
      it('should return empty object', function () {
        var res = areEquivalent(_.safeSet(null), e);
        expect(res).to.equal(true);
      });
      describe('standard value,', function () {
        it('should return empty object', function () {
          var res = areEquivalent(_.safeSet(null, '', TEST_VAL), e);
          expect(res).to.equal(true);
        });
      });
      describe('standard value, overwrite off, return value set on,', function () {
        it('should return empty object', function () {
          expect(_.safeSet(null, '', TEST_VAL, false, true)).to.equal(TEST_VAL);
        });
      });
    });
  });
  describe('given an input object', function(){
    describe('and no other parameters,', function () {
      it('should return the object', function () {
        expect(_.safeSet(DEFAULT_VAL)).to.equal(DEFAULT_VAL);
      });
    });
    describe('and no path and a value to set and no other parameters,', function () {
      it('should return the object', function () {
        expect(_.safeSet(DEFAULT_VAL, undefined, TEST_VAL)).to.equal(DEFAULT_VAL);
      });
    });
    describe('and an empty path', function () {
      it('should return the object', function () {
        var base = owl.deepCopy(DEFAULT_VAL);
        var res = areEquivalent(_.safeSet(DEFAULT_VAL, ''), base);
        expect(res).to.equal(true);
      });
      describe('and a value to set and no other parameters,', function () {
        it('should return the object', function () {
          expect(_.safeSet(DEFAULT_VAL, '', TEST_VAL)).to.equal(DEFAULT_VAL);
        });
      });
      describe('and a test value to set', function () {
        describe('and overwrite set to true,', function () {
          it('should return the test', function () {
            expect(_.safeSet(DEFAULT_VAL, '', TEST_VAL, true)).to.equal(TEST_VAL);
          });
        });
        describe('and overwrite and returnValueSet set to true,', function () {
          it('should return the test', function () {
            expect(_.safeSet(DEFAULT_VAL, '', TEST_VAL, true, true)).to.equal(TEST_VAL);
          });
        });
      });

      describe('and a known path', function(){
        describe('to a previously defined attribute', function(){
          describe('with a null value to set', function(){
            it('should set the value of the attribute to null and return the object', function(){
              var res = _.safeSet(DEFAULT_VAL, 'a.aa.aaa.aaaa', null);
              expect(res).to.equal(DEFAULT_VAL);
              expect(res.a.aa.aaa.aaaa).to.equal(null);
            });
            describe('and overwrite set to true', function(){
              it('should set the value of the attribute to null and return the object', function(){
                var res = _.safeSet(DEFAULT_VAL, 'a.aa.aaa.aaaa', null);
                expect(res).to.equal(DEFAULT_VAL);
                expect(res.a.aa.aaa.aaaa).to.equal(null);
              });
            });
            describe('and overwrite set to true', function(){
              it('should set the value of the attribute to null and return the object', function(){
                var res = _.safeSet(DEFAULT_VAL, 'a.aa.aaa.aaaa', null);
                expect(res).to.equal(DEFAULT_VAL);
                expect(res.a.aa.aaa.aaaa).to.equal(null);
              });
            });
            describe('and overwrite set to false', function(){
              it('should NOT set the value of the attribute to null but still return the object', function(){
                var res = _.safeSet(DEFAULT_VAL, 'a.aa.aaa.aaaa', null, false);
                expect(res).to.equal(DEFAULT_VAL);
                expect(res.a.aa.aaa.aaaa).to.equal(ns);
              });
            })
          });

          describe('with a non-null value to set', function(){
            it('should set the value of the attribute to the non-null and return the object', function(){
              var res = _.safeSet(DEFAULT_VAL, 'a.aa.aaa.aaaa', NON_NULL);
              expect(res).to.equal(DEFAULT_VAL);
              expect(res.a.aa.aaa.aaaa).to.equal(NON_NULL);
            });
            describe('and overwrite set to true', function(){
              it('should set the value of the attribute to the non-null and return the object', function(){
                var res = _.safeSet(DEFAULT_VAL, 'a.aa.aaa.aaaa', NON_NULL);
                expect(res).to.equal(DEFAULT_VAL);
                expect(res.a.aa.aaa.aaaa).to.equal(NON_NULL);
              });
            });
            describe('and overwrite set to true', function(){
              it('should set the value of the attribute to non-null and return the object', function(){
                var res = _.safeSet(DEFAULT_VAL, 'a.aa.aaa.aaaa', NON_NULL);
                expect(res).to.equal(DEFAULT_VAL);
                expect(res.a.aa.aaa.aaaa).to.equal(NON_NULL);
              });
              describe('and returnSetValue to true', function(){
                it('should set the value of the attribute to the non-null and return the original value of the attribute', function(){
                  var res = _.safeSet(DEFAULT_VAL, 'a.aa.aaa.aaaa', NON_NULL, true, true);
                  expect(res).to.equal(NON_NULL);
                  expect(DEFAULT_VAL.a.aa.aaa.aaaa).to.equal(NON_NULL);
                });
              })
            });
            describe('and overwrite set to false', function(){
              it('should NOT set the value of the attribute to the non-null but still return the object', function(){
                var res = _.safeSet(DEFAULT_VAL, 'a.aa.aaa.aaaa', NON_NULL, false);
                expect(res).to.equal(DEFAULT_VAL);
                expect(res.a.aa.aaa.aaaa).to.equal(ns);
              });
              describe('and returnSetValue to true', function(){
                it('should NOT set the value of the attribute to the non-null and return the previous value of the attribute', function(){
                  var res = _.safeSet(DEFAULT_VAL, 'a.aa.aaa.aaaa', NON_NULL, false, true);
                  expect(res).to.equal(ns);
                  expect(DEFAULT_VAL.a.aa.aaa.aaaa).to.equal(ns);
                });
              })
            })
          });
        })
      });

      describe('and an unknown path', function(){
        describe('to a previously undefined attribute', function(){
          describe('with a null value to set', function(){
            it('should set the value of the attribute to null and return the object', function(){
              var res = _.safeSet(DEFAULT_VAL, 'a.aa.aaa.bbbb', null);
              expect(res).to.equal(DEFAULT_VAL);
              expect(res.a.aa.aaa.bbbb).to.equal(null);
            });
            describe('and overwrite set to true', function(){
              it('should set the value of the attribute to null and return the object', function(){
                var res = _.safeSet(DEFAULT_VAL, 'a.aa.aaa.bbbb', null);
                expect(res).to.equal(DEFAULT_VAL);
                expect(res.a.aa.aaa.bbbb).to.equal(null);
              });
            });
            describe('and overwrite set to true', function(){
              it('should set the value of the attribute to null and return the object', function(){
                var res = _.safeSet(DEFAULT_VAL, 'a.aa.aaa.bbbb', null);
                expect(res).to.equal(DEFAULT_VAL);
                expect(res.a.aa.aaa.bbbb).to.equal(null);
              });
            });
            describe('and overwrite set to false', function(){
              it('should NOT set the value of the attribute to null but still return the object', function(){
                var res = _.safeSet(DEFAULT_VAL, 'a.aa.aaa.bbbb', null, false);
                expect(res).to.equal(DEFAULT_VAL);
                expect(res.a.aa.aaa.bbbb).to.equal(null);
              });
            })
          });

          describe('with a non-null value to set', function(){
            it('should set the value of the attribute to the non-null and return the object', function(){
              var res = _.safeSet(DEFAULT_VAL, 'a.aa.aaa.bbbb', NON_NULL);
              expect(res).to.equal(DEFAULT_VAL);
              expect(res.a.aa.aaa.bbbb).to.equal(NON_NULL);
            });
            describe('and overwrite set to true', function(){
              it('should set the value of the attribute to the non-null and return the object', function(){
                var res = _.safeSet(DEFAULT_VAL, 'a.aa.aaa.bbbb', NON_NULL);
                expect(res).to.equal(DEFAULT_VAL);
                expect(res.a.aa.aaa.bbbb).to.equal(NON_NULL);
              });
            });
            describe('and overwrite set to true', function(){
              it('should set the value of the attribute to non-null and return the object', function(){
                var res = _.safeSet(DEFAULT_VAL, 'a.aa.aaa.bbbb', NON_NULL);
                expect(res).to.equal(DEFAULT_VAL);
                expect(res.a.aa.aaa.bbbb).to.equal(NON_NULL);
              });
              describe('and returnSetValue to true', function(){
                it('should set the value of the attribute to the non-null and return the original value of the attribute', function(){
                  var res = _.safeSet(DEFAULT_VAL, 'a.aa.aaa.bbbb', NON_NULL, true, true);
                  expect(res).to.equal(NON_NULL);
                  expect(DEFAULT_VAL.a.aa.aaa.bbbb).to.equal(NON_NULL);
                });
              })
            });
            describe('and overwrite set to false', function(){
              it('should NOT set the value of the attribute to the non-null but still return the object', function(){
                var res = _.safeSet(DEFAULT_VAL, 'a.aa.aaa.bbbb', NON_NULL, false);
                expect(res).to.equal(DEFAULT_VAL);
                expect(res.a.aa.aaa.bbbb).to.equal(NON_NULL);
              });
              describe('and returnSetValue to true', function(){
                it('should NOT set the value of the attribute to the non-null and return the previous value of the attribute', function(){
                  var res = _.safeSet(DEFAULT_VAL, 'a.aa.aaa.bbbb', NON_NULL, false, true);
                  expect(res).to.equal(NON_NULL);
                  expect(DEFAULT_VAL.a.aa.aaa.bbbb).to.equal(NON_NULL);
                });
              })
            })
          });
        });
        describe('to a previously defined attribute with a null value', function(){
          describe('with a null value to set', function(){
            it('should set the value to null (again)', function(){
              _.safeSet(DEFAULT_VAL, 'n', null);
              expect(DEFAULT_VAL.n).to.equal(null);
            })
          });
          describe('with a non-null value to set', function(){
            it('should set the value to the non-null', function(){
              _.safeSet(DEFAULT_VAL, 'n', NON_NULL);
              expect(DEFAULT_VAL.n).to.equal(NON_NULL);
            });
            describe('with overwrite set to false', function(){
              it('should set the value to the non-null', function(){
                _.safeSet(DEFAULT_VAL, 'n', NON_NULL, false);
                expect(DEFAULT_VAL.n).to.equal(NON_NULL);
              });
            })
          })
        });
      });

      describe('and a bad path with empty keys in it', function(){
        it('should not blow up but should call the log function', function(){
          var flag = false;
          var oldLogFunction = console.log;
          console.log = function(someString){flag = true};
          _.safeSet(DEFAULT_VAL, 'a..aaa.aaaa', NON_NULL);
          expect(flag).to.equal(true);
          delete console.log;
        })
      })
    });
  });
});
