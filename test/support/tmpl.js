var fs = require('fs');
var path = require('path'); // Add path module for path sanitization

var variableRegExp = /\$([0-9a-zA-Z\.]+)/g;

module.exports = function renderFile(fileName, options, callback) {
  // Input validation
  if (typeof fileName !== 'string') {
    return callback(new Error('fileName must be a string'));
  }
  
  try {
    // Get the base directory (current working directory in this case)
    var baseDir = process.cwd();
    
    // Normalize the path to remove any '..' sequences and resolve it to an absolute path
    var normalizedPath = path.normalize(path.resolve(baseDir, fileName));
    
    // Security check: ensure the normalized path is within the base directory
    if (!normalizedPath.startsWith(baseDir)) {
      return callback(new Error('Access denied: Path is outside the allowed directory'));
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

    // Use the validated and normalized path
    fs.readFile(normalizedPath, 'utf8', onReadFile);
  } catch (error) {
    callback(error);
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