'use strict'

var express = require('../../');
var app = module.exports = express();
var users = require('./db');

// so either you can deal with different types of formatting
// for expected response in index.js
app.get('/', function(req, res){
  res.format({
    html: function(){
      res.send('<ul>' + users.map(function(user){
        return '<li>' + user.name + '</li>';
      }).join('') + '</ul>');
    },

    text: function(){
      res.send(users.map(function(user){
        return ' - ' + user.name + '\n';
      }).join(''));
    },

    json: function(){
      res.json(users);
    }
  });
});

// or you could write a tiny middleware like
// this to add a layer of abstraction
// and make things a bit more declarative:

/**
 * Format middleware to handle content negotiation.
 * 
 * WARNING: This function should ONLY be used with hardcoded, trusted paths.
 * Using paths derived from user input or other untrusted sources could lead 
 * to security vulnerabilities like path traversal or remote code execution.
 * 
 * @param {string} requestedPath - Path to the module. MUST be a hardcoded, trusted string.
 * @returns {Function} Express middleware function.
 */
function format(requestedPath) {
  // Ensure the path is a string
  if (typeof requestedPath !== 'string') {
    throw new Error('Path must be a string.');
  }
  
  // Warn if the path might be dynamic (this is a heuristic and not foolproof)
  if (
    requestedPath.includes('${') || 
    requestedPath.includes('`') || 
    requestedPath.includes('req.') || 
    requestedPath.includes('request.') || 
    requestedPath.includes('user.')
  ) {
    throw new Error('Potential dynamic path detected. This is a security risk.');
  }
  
  var obj = require(requestedPath);
  return function(req, res){
    res.format(obj);
  };
}

app.get('/users', format('./users'));

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}