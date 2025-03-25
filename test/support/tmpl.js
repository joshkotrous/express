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
      if (value === null || value === undefined) {
        return undefined;
      }
      
      var prop = parts[i];
      // Prevent prototype pollution by checking if property exists directly on the object
      if (!Object.prototype.hasOwnProperty.call(value, prop)) {
        return undefined;
      }
      
      value = value[prop];
    }

    return value;
  };
}