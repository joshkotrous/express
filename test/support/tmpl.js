var fs = require('fs');
var path = require('path');

var variableRegExp = /\$([0-9a-zA-Z\.]+)/g;

module.exports = function renderFile(fileName, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  
  try {
    // Normalize the path
    var normalizedPath = path.normalize(fileName);
    
    // Check for path traversal attempts
    if (normalizedPath.indexOf('..') !== -1) {
      var err = new Error('Access denied: Invalid file path');
      callback(err);
      return;
    }

    function onReadFile(err, str) {
      if (err) {
        callback(err);
        return;
      }

      try {
    for (var i = 0; i < parts.length && value != null; i++) {
      // Only access own properties, not from prototype chain
      if (Object.prototype.hasOwnProperty.call(value, parts[i])) {
        value = value[parts[i]];
      } else {
        value = undefined;
        break;
      }
    }

    return value;
  };
}
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