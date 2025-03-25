'use strict'

var users = require('./db');

// Function to sanitize HTML to prevent XSS attacks
function escapeHtml(text) {
  if (text === undefined || text === null) {
    return '';
  }
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

exports.html = function(req, res){
  res.send('<ul>' + users.map(function(user){
    return '<li>' + escapeHtml(user.name) + '</li>';
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