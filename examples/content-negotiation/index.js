'use strict'

var express = require('../../');
var app = module.exports = express();
var users = require('./db');

// Function to escape HTML special characters to prevent XSS
function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// so either you can deal with different types of formatting
// for expected response in index.js
app.get('/', function(req, res){
  res.format({
    html: function(){
      res.send('<ul>' + users.map(function(user){
        return '<li>' + escapeHtml(user.name) + '</li>';
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

function format(path) {
  var obj = require(path);
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