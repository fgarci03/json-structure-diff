# json-structure-diff

Compare JSON objects for structure equality, despite the actual content

## Installation

```shell
npm install --save json-structure-diff
```

or

```shell
bower install --save json-structure-diff
```

## Usage

NPM:
```js
var compare = require('json-structure-diff').compareJSONObjects;

var obj1 = {
  parent: 'nameOfObject',
  content: {
    whatever: 'you',
    want: {
      here: '!'
    }
  }
};

var obj2 = {
  parent: 'nameOfComparedObject',
  content: {
    whatever: 'you',
    want: {
      here: {
        is: 'cool',
        right: '?'
      }
    }
  }
};

var objectsToCompare = [obj1, obj2];

var errors = compare(objectsToCompare, options);
```

BOWER:
```js
<script src="json-structure-diff/index.js"></script>
<script>
  jsonStructureDiff.compareJSONObjects([oj1, obj2], options);
</script>
```

This function accepts an array of objects to be compared, and returns a list of errors if they exist, or null if they don't.
It checks strictly for JSON structure without looking at the contents. It does check if the ```typeof``` variable matches!


The objects need to have 2 properties:
+ **parent**: The name of the object, to use on the error list;
+ **content**: the actual content of the object to compare.


Optionally, you can pass an 'options' object with a ```humanReadable``` boolean property. If true, the return value of the method
is an array of strings (```['nameOfObject > want.here is string and nameOfComparedObject > want.here is object']```), else it's
an array of objects:
```js
[
  {
    parent: 'nameOfObject.want.here',
    comparedParent: 'nameOfComparedObject.want.here',
    typeOfParent: 'string',
    typeOfComparedParent: 'object'
  }
]
```
Default value is false.

## Credits
[Filipe Garcia](https://github.com/fgarci03/)

## License

ISC

## TODO
+ Handle circular references without throwing error - [https://github.com/douglascrockford/JSON-js/blob/master/cycle.js](https://github.com/douglascrockford/JSON-js/blob/master/cycle.js);
+ TESTS!!;
+ Handle ALL types of javascript variables (stop using ```typeof```);
