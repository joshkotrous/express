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

    for (var i = 0; i < parts.length; i++) {
      // Prevent prototype pollution by blocking dangerous properties
      if (parts[i] === '__proto__' || parts[i] === 'constructor' || parts[i] === 'prototype') {
        return undefined;
      }
      
      // Ensure the property exists on the object itself, not on its prototype chain
      if (value && typeof value === 'object' && Object.prototype.hasOwnProperty.call(value, parts[i])) {
        value = value[parts[i]];
      } else {
        return undefined;
      }
    }

    return value;
  };
}