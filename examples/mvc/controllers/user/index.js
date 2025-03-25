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
  
  // Validate that body.user exists
  if (!body.user) {
    res.message('Invalid input: Missing user data');
    return res.redirect('/user/' + req.user.id);
  }
  
  // Validate that body.user.name is a string
  if (typeof body.user.name !== 'string') {
    res.message('Invalid input: Name must be a string');
    return res.redirect('/user/' + req.user.id);
  }
  
  // Trim whitespace
  const trimmedName = body.user.name.trim();
  
  // Validate name is not empty and has a reasonable length
  if (trimmedName === '') {
    res.message('Invalid input: Name cannot be empty');
    return res.redirect('/user/' + req.user.id);
  }
  
  if (trimmedName.length > 100) {
    res.message('Invalid input: Name must be less than 100 characters');
    return res.redirect('/user/' + req.user.id);
  }
  
  // Store the sanitized name
  req.user.name = trimmedName;
  res.message('Information updated!');
  res.redirect('/user/' + req.user.id);
};