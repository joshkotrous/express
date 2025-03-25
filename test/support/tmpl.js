var fs = require('fs');

var variableRegExp = /\$([0-9a-zA-Z\.]+)/g;

module.exports = function renderFile(fileName, options, callback) {
  function onReadFile(err, str) {
    if (err) {
      callback(err);
      return;
    }

    try {
      str = str.replace(variableRegExp, generateVariableLookup(options));
    } catch (e) {
      err = e;
      err.name = 'RenderError'
    }

    callback(err, str);
  }

  fs.readFile(fileName, 'utf8', onReadFile);
};

function generateVariableLookup(data) {
  return function variableLookup(str, path) {
    var parts = path.split('.');
    var value = data;

    try {
      for (var i = 0; i < parts.length; i++) {
        // Safely access nested properties
        if (value === undefined || value === null || typeof value !== 'object') {
          return '';
        }
        value = value[parts[i]];
      }
    } catch (e) {
      return '';
    }

    // Handle different types and prevent injections
    if (value === undefined || value === null) {
      return '';
    } else if (typeof value === 'function' || typeof value === 'object') {
      // Prevent function or object injection by returning a safe string representation
      return '[object]';
    } else {
      // For primitive types, convert to string and escape potentially dangerous characters
      return String(value).replace(/[<>{}[\]()$\\]/g, '\\$&');
    }
  };
}