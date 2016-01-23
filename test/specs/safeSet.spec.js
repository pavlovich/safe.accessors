/**
 * Created by peter.pavlovich on 6/9/15.
 */

var expect = require('chai').expect;

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

  var s, e, u, n, no, ns, o, ne, nu, nn, DEFAULT_VAL, TEST_VAL, NON_NULL,
    sx, ex, ux, nx, nox, nsx, ox, nex, nux, nnx, DEFAULT_VALx;

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

    sx = 'aString';
    ex = {};
    ux = undefined;
    nx = null;
    nox = {aaa: {aaaa: nsx}};
    nsx = 'a nested string';
    ox = {aa: nox, bb: nsx};
    nex = {};
    nux = undefined;
    nnx = null;
    DEFAULT_VALx = {a: ox, e: ex, u: ux, n: nx, s: sx};

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
        var res = areEquivalent(_.safeSet(DEFAULT_VAL, ''), DEFAULT_VALx);
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
                var res = _.safeSet(DEFAULT_VAL, 'a.aa.aaa.aaaa', null, true);
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
                var res = _.safeSet(DEFAULT_VAL, 'a.aa.aaa.aaaa', NON_NULL, true);
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

      describe('xxx', function(){
        it('should work', function(){
          var peter = 'hello';
          var res = _.safeSet({}, 'a.b.c', peter);
          expect(res.a.b.c).to.equal(peter)
        })
      })

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
