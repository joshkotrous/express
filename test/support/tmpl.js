var fs = require('fs');

var variableRegExp = /\$([0-9a-zA-Z\.]+)/g;

module.exports = function renderFile(fileName, options, callback) {
  function onReadFile(err, str) {
    if (err) {
      callback(err);
      return;
    }

    try {
      str = str.replace(variableRegExp, generateVariableLookup(options || {}));
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
      if (value === undefined || value === null) {
        return '';
      }
      value = value[parts[i]];
    }

    // Handle undefined/null values
    if (value === undefined || value === null) {
      return '';
    }
    
    // For functions, prevent execution
    if (typeof value === 'function') {
      return '[Function]';
    }
    
    // Convert to string safely
    try {
      return String(value);
    } catch (e) {
      return '';
    }
  };
}