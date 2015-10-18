/*
 * json-structure-diff
 * https://github.com/fgarci03/json-structure-diff
 *
 * Copyright (c) 2015 Filipe Garcia
 * Licensed under the MIT license.
 */
(function () {
  'use strict';

  var root = typeof self === 'object' && self.self === self && self ||
    typeof global === 'object' && global.global === global && global ||
    this;

  // Create a safe reference to the Logical object for use below.
  var jsonStructureDiff = function (obj) {
    if (obj instanceof jsonStructureDiff) return obj;
    if (!(this instanceof jsonStructureDiff)) return new jsonStructureDiff(obj);
  };

  // Save the previous value of the `logical` variable.
  var previousJsonStructureDiff = root.jsonStructureDiff;

  // Run Logical.js in *noConflict* mode, returning the `logical` variable to its
  // previous owner. Returns a reference to the Logical object.
  jsonStructureDiff.noConflict = function () {
    root.jsonStructureDiff = previousJsonStructureDiff;
    return this;
  };

  // Current version.
  jsonStructureDiff.VERSION = '0.0.2';


  //-------------

  var errors = [];

  function checkIfIsCircular(objects) {
    for (var i = 0; i < objects.length; i++) {
      try {
        JSON.stringify(objects[i]);
      }
      catch (e) {
        throw "Object has circular references!";
      }
    }
  }

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

  /**
   * Compares JSON objects for their structure
   *
   * @param {Array} srcObjs   The objects to compare
   * @param {Object} options  Customization options
   * @returns {Array}         List of errors
   */
  jsonStructureDiff.compareJSONObjects = function (srcObjs, options) {
    errors = [];
    options = options ? options : {};
    options.nested = false;
    checkIfIsCircular(srcObjs);
    return compare(srcObjs, options);
  };

  //-------------

  // Export the Logical object for **Node.js**, with
  // backwards-compatibility for their old module API. If we're in
  // the browser, add `logical` as a global object.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = jsonStructureDiff;
    } else {
      exports.jsonStructureDiff = jsonStructureDiff;
    }
  } else {
    root.jsonStructureDiff = jsonStructureDiff;
  }

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, Logical registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('jsonStructureDiff', [], function () {
      return jsonStructureDiff;
    });
  }
})();
