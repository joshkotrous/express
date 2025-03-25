var fs = require('fs');
var path = require('path');

var variableRegExp = /\$([0-9a-zA-Z\.]+)/g;

module.exports = function renderFile(fileName, options, callback) {
  // Handle the case where options is the callback
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  
  options = options || {};

  // Validate input
  if (!fileName || typeof fileName !== 'string') {
    return callback(new Error('Invalid fileName parameter'));
  }

  // Process the file path for security
  var safePath;
  try {
    // Normalize the path to remove any ".." sequences, etc.
    var normalizedPath = path.normalize(fileName);
    
    // Use the provided baseDir, or current directory if not specified,
    // or null to disable path restriction
    var baseDir = options.baseDir !== undefined ? options.baseDir : process.cwd();
    
    if (baseDir === null) {
      // Path restriction is explicitly disabled
      safePath = normalizedPath;
    } else {
      var resolvedBaseDir = path.resolve(baseDir);
      
      // If it's a relative path, resolve it relative to baseDir
      if (!path.isAbsolute(normalizedPath)) {
        safePath = path.resolve(resolvedBaseDir, normalizedPath);
      } else {
        safePath = normalizedPath;
      }
      
      // Check that the path is within the allowed directory
      if (!safePath.startsWith(resolvedBaseDir)) {
        return callback(new Error('Access to file outside the allowed directory is not permitted'));
      }
    }
  } catch (err) {
    return callback(err);
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

  fs.readFile(safePath, 'utf8', onReadFile);
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