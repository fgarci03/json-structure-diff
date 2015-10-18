var compare = require('./index').compareJSONObjects;

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

console.log(compare([obj1, obj2]));
console.log(compare([obj1, obj2], {humanReadable: true}));
