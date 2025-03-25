'use strict'

var users = require('./db');

// Function to escape HTML special characters
function escapeHTML(str) {
  if (typeof str !== 'string') {
    return '';
  }
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

exports.html = function(req, res){
  res.send('<ul>' + users.map(function(user){
    return '<li>' + escapeHTML(user.name) + '</li>';
  }).join('') + '</ul>');
};

exports.text = function(req, res){
  res.send(users.map(function(user){
    return ' - ' + user.name + '\n';
  }).join(''));
};

exports.json = function(req, res){
  res.json(users);
};