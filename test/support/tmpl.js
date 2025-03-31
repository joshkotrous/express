var fs = require('fs');
var path = require('path');

var variableRegExp = /\$([0-9a-zA-Z\.]+)/g;

// Base directory for templates - this defaults to current working directory
var BASE_TEMPLATES_DIR = process.cwd();

module.exports = function renderFile(fileName, options, callback) {
  // Validate input
  if (typeof fileName !== 'string') {
    process.nextTick(function() {
      callback(new TypeError('fileName must be a string'));
    });
    return;
  }

  // Path validation and normalization
  var safePath;
  try {
    // Resolve to absolute path
    var resolvedPath = path.resolve(BASE_TEMPLATES_DIR, fileName);
    
    // Ensure the path is within the base directory
    if (!resolvedPath.startsWith(BASE_TEMPLATES_DIR)) {
      process.nextTick(function() {
        callback(new Error('Invalid file path'));
      });
      return;
    }
    
    safePath = resolvedPath;
  } catch (err) {
    process.nextTick(function() {
      callback(err);
    });
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