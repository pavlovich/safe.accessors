<span class="github-only">

The stable release documentation can be found here https://pavlovich.github.io/safe.accessors/

</span>

# safe.accessors [![Build Status](https://secure.travis-ci.org/pavlovich/safe.accessors.png?branch=master)](http://travis-ci.org/pavlovich/safe.accessors) #

Javascript lacks a way to safely get and set values of nested attributes or a way to call functions with value retrieved from a nested structure.
This is an attempt to fill that gap. 

[c]: https://github.com/pavlovich/safe.accessors/blob/master/CHANGELOG.markdown#300

## Usage

### In Node.js and Browserify

Install from npm

    npm install safe.accessors

Require individual functions

```javascript
var safeGet = require("safe.accessors/safeGet");

safeGet(myObj, "x.y.z.a.b.c", default, allowNull);
// => xxx
```

or load the full library to enable chaining

```javascript
var sa = require("safe.accessors");

sa(x).trim().capitalize().value();
// => "xxx"
```

but especially when using with [Browserify][] the individual function approach
is recommended because using it you only add those functions to your bundle you
use.

[Browserify]: http://browserify.org/

### In Meteor

From your [Meteor][] project folder

```shell
    meteor add safe.accessors:safe.accessors
```

and you'll be able to access the library with the ***sa*** global from both the server and the client.

```javascript

var allowNulls = false;
sa.safeGet(obj, 'a.b.c.d.e', 'default value', allowNulls);
// => default value

s("   epeli  ").trim().capitalize().value();
// => "Epeli"
```

[Meteor]: http://www.meteor.com/

### Others

The `dist/underscore.string.js` file is an [UMD][] build. You can load it using
an AMD loader such as [RequireJS][] or just stick it to a web page and access
the library from the ***s*** global.

[UMD]: https://github.com/umdjs/umd
[RequireJS]: http://requirejs.org/

### Underscore.js/Lo-Dash integration

It is possible use as Underscore.js/Lo-Dash extension

```javascript
_.mixin(sa.exports());
```

## Download

  * [Development version](https://raw.github.com/pavlovich/safe.accessors/master/dist/safe.accessors.js) *Uncompressed with Comments*
  * [Production version](https://github.com/pavlovich/safe.accessors/raw/master/dist/safe.accessors.min.js) *Minified*

## API

### Individual functions

#### safeGet(object, [ path='', defaultValue=null, allowNulls=false]) => object

Traverses the supplied chain of attributes of the provided object until it reaches the target (final) attribute or hits a 'null'. If it successfully reaches the end, the value of the final attribute is returned. If a null is encountered or if the final value is null, then, if nulls are allowed, a null is returned. Otherwise, the default value is returned.

```javascript
safeGet({something: {somethingElse: {theFinalAttribute: 'hello'}, 'something.somethingElse.theFinalAttribute', 'default value', false);
// => "hello"

safeGet({something: {somethingElse: {theFinalAttribute: 'hello'}, 'something.somethingElseXX.theFinalAttributeXXX', 'default value');
// => "default value"

safeGet({something: {somethingElse: {theFinalAttribute: null}, 'something.somethingElse.theFinalAttribute', 'default value', true);
// => null
```


#### safeSet(object, [ path='' ]) => object

Sets the value of the given path relative to the supplied object to the provided value.

```javascript
safeSet({}, "a.b.c.d", 'hello');
// => 'hello'

safeSet({a: {b: {c: {d: 'yes'}}}}, "a.b.c.d", 'hello');
// => 'hello'

safeSet({a: {b: {c: {d: 'yes'}}}}, "a.b.c.d", 'hello', false);
// => 'yes'

```

#### safeCall(object, [path='', defaultValue, functionToCall, context, allowNull, allowUndefined, defaultReturn, allowNullResult, allowUndefinedResult]) => string

Converts first letter of the string to uppercase. If `true` is passed as second argument the rest
of the string will be converted to lower case.

```javascript
safeCall("foo Bar");
// => "Foo Bar"

safeCall("FOO Bar", true);
// => "Foo bar"
```

#### isVoid(object) => boolean

Returns true if the supplied object is undefined or null, false otherwise.

```javascript
isVoid("hello");
// => false

isVoid(null);
// => true

isVoid(undefined);
// => true
```

## Maintainers ##

This library is maintained by

  - Peter Pavlovich – ***[@pavlovich](https://github.com/pavlovich)***
  
## Licence ##

The MIT License

Copyright (c) 2016 Peter Pavlovich pavlovich@gmail.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
