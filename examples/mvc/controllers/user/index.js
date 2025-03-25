'use strict'

/**
 * Module dependencies.
 */

var db = require('../../db');

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
  
  // Validate input
  if (!body.user || typeof body.user.name !== 'string') {
    res.status(400).send('Invalid input: name must be a string');
    return;
  }
  
  // Sanitize input - trim whitespace and escape HTML
  var sanitizedName = body.user.name.trim()
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
  
  // Additional validation - check length constraints
  if (sanitizedName.length < 1 || sanitizedName.length > 100) {
    res.status(400).send('Invalid input: name must be between 1 and 100 characters');
    return;
  }
  
  // Update user with sanitized input
  req.user.name = sanitizedName;
  
  res.message('Information updated!');
  res.redirect('/user/' + req.user.id);
};