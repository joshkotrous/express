'use strict'

/**
 * Module dependencies.
 */

var db = require('../../db');

// Simple function to sanitize input against XSS
function sanitizeInput(input) {
  // If input is not a string, return empty string
  if (typeof input !== 'string') {
    return '';
  }
  
  // Remove or neutralize potentially harmful content
  // This targets common XSS vectors while preserving most legitimate content
  return input
    // Remove script tags and their contents
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    // Remove event handlers
    .replace(/on\w+\s*=\s*["']?[^"']*["']?/gi, '')
    // Neutralize javascript: URLs
    .replace(/javascript:/gi, 'disabled-javascript:');
}

exports.engine = 'hbs';

exports.before = function(req, res, next){
  var id = req.params.user_id;
  if (!id) return next();
  // pretend to query a database...
  process.nextTick(function(){
    req.user = db.users[id];
    // cant find that user
    if (!req.user) return next('route');
    // found it, move on to the routes
    next();
  });
};

exports.list = function(req, res, next){
  res.render('list', { users: db.users });
};

exports.edit = function(req, res, next){
  res.render('edit', { user: req.user });
};

exports.show = function(req, res, next){
  res.render('show', { user: req.user });
};

exports.update = function(req, res, next){
  var body = req.body;
  
  // Make sure body.user exists to avoid potential undefined errors
  if (body && body.user) {
    // Sanitize the user input before storing it
    req.user.name = sanitizeInput(body.user.name);
    res.message('Information updated!');
  } else {
    res.message('Invalid input. Please try again.');
  }
  
  res.redirect('/user/' + req.user.id);
};