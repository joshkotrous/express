var fs = require('fs');
var path = require('path');

var variableRegExp = /\$([0-9a-zA-Z\.]+)/g;

module.exports = function renderFile(fileName, options, callback) {
  // Validate fileName is a string
  if (typeof fileName !== 'string') {
    return callback(new Error('fileName must be a string'));
  }
  
  try {
    // Normalize the path (removes redundant separators, up-level references, etc.)
    var normalizedPath = path.normalize(fileName);
    
    // Check for path traversal attempts in a platform-independent way
    // Looking for ".." segments that could potentially navigate outside allowed directories
    if (normalizedPath.split(/[\/\\]/).includes('..')) {
      return callback(new Error('Path traversal attempt detected'));
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

    fs.readFile(normalizedPath, 'utf8', onReadFile);
  } catch (e) {
    // Handle any path processing errors
    callback(e);
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