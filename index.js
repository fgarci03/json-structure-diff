/*
 * json-structure-diff
 * https://github.com/fgarci03/json-structure-diff
 *
 * Copyright (c) 2015 Filipe Garcia
 * Licensed under the MIT license.
 */
(function () {
  'use strict';

  var errors = [];

  function compare(objs, options) {
    // iterate the array of objects to compare
    for (var i = 0; i < objs.length; i++) {
      var json = objs[i];

      if (!json.hasOwnProperty('parent') || !json.hasOwnProperty('content')) {
        throw "Object does not have the required properties (parent, content).";
      } else {
        // iterate each object's properties
        for (var prop in json.content) {
          if (json.content.hasOwnProperty(prop)) {
            var separator = !options.nested && options.humanReadable ? ' > ' : '.';

            // iterate the rest of the array to get the remaining objects
            for (var j = i; j < objs.length; j++) {
              var comparedJson = objs[j];

              var parentJson = json.parent + separator + prop;
              var comparedParentJson = comparedJson.parent + separator + prop;

              var jsonContent = json.content[prop];
              var comparedJsonContent = comparedJson.content[prop];

              if (typeof jsonContent === typeof comparedJsonContent) {
                // if the property is also an object (and has data), recursively check it
                if (typeof jsonContent === 'object' && Object.keys(jsonContent).length) {
                  var formattedObjects = [
                    {
                      parent: parentJson,
                      content: jsonContent
                    },
                    {
                      parent: comparedParentJson,
                      content: comparedJsonContent
                    }
                  ];
                  options.nested = true;
                  compare(formattedObjects, options);
                } else {
                  options.nested = false;
                }
              } else {
                if (options.humanReadable) {
                  errors.push(parentJson + ' is ' + typeof jsonContent + ' and ' + comparedParentJson + ' is ' + typeof comparedJsonContent);
                } else {
                  errors.push({
                    parent: parentJson,
                    comparedParent: comparedParentJson,
                    typeOfParent: typeof jsonContent,
                    typeOfComparedParent: typeof comparedJsonContent
                  })
                }
              }
            }
          }
        }
      }
    }

    return errors.length ? errors : null;
  }

  module.exports = {
    compareJSONObjects: function (srcObjs, options) {
      errors = [];
      options = options ? options : {};
      options.nested = false;
      return compare(srcObjs, options);
    }
  };
})();
