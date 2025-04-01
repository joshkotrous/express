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
  
  // Input validation
  if (!body.user || !body.user.name || typeof body.user.name !== 'string') {
    res.message('Invalid user data');
    return res.redirect('back'); // Redirect back to the form
  }
  
  // Sanitize the input - basic trimming and length restriction
  var sanitizedName = body.user.name.trim();
  if (sanitizedName.length > 100) {
    sanitizedName = sanitizedName.substring(0, 100);
  }
  
  // Update with sanitized value
  req.user.name = sanitizedName;
  
  res.message('Information updated!');
  res.redirect('/user/' + req.user.id);
};
