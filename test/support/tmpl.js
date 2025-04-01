var fs = require('fs');
var path = require('path'); // Add path module

var variableRegExp = /\$([0-9a-zA-Z\.]+)/g;
var baseDir = process.cwd(); // Default base directory is the current working directory

module.exports = function renderFile(fileName, options, callback) {
  try {
    // Resolve the absolute path
    var resolvedPath = path.resolve(fileName);
    
    // Check if the path is outside the base directory
    if (!resolvedPath.startsWith(path.resolve(baseDir))) {
      var err = new Error('Path traversal attempt detected: attempted to access a file outside the allowed directory');
      err.name = 'SecurityError';
      callback(err);
      return;
    }
    
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

    fs.readFile(resolvedPath, 'utf8', onReadFile);
  } catch (err) {
    callback(err);
    return;
  }
};

function generateVariableLookup(data) {
  return function variableLookup(str, path) {
    var parts = path.split('.');
    var value = data;

    for (var i = 0; i < parts.length; i++) {
      value = value[parts[i]];
    }

    return value;
  };
}

// Export a method to set the base directory
module.exports.setBaseDir = function(dir) {
  baseDir = dir;
};