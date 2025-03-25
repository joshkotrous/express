var fs = require('fs');

var variableRegExp = /\$([0-9a-zA-Z\.]+)/g;

module.exports = function renderFile(fileName, options, callback) {
  function onReadFile(err, str) {
    if (err) {
      callback(err);
      return;
    }

    try {
      // Ensure options is an object
      var safeOptions = options && typeof options === 'object' ? options : {};
      str = str.replace(variableRegExp, generateVariableLookup(safeOptions));
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
        if (value == null) {
          return '';
        }
        value = value[parts[i]];
      }

      return value == null ? '' : value;
    } catch (e) {
      return ''; // Return empty string on errors
    }
  };
}