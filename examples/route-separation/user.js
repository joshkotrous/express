'use strict'

// Fake user database

var users = [
  { name: 'TJ', email: 'tj@vision-media.ca' },
  { name: 'Tobi', email: 'tobi@vision-media.ca' }
];

exports.list = function(req, res){
  res.render('users', { title: 'Users', users: users });
};

exports.load = function(req, res, next){
  var id = req.params.id;
  req.user = users[id];
  if (req.user) {
    next();
  } else {
    var err = new Error('cannot find user ' + id);
    err.status = 404;
    next(err);
  }
};

exports.view = function(req, res){
  res.render('users/view', {
    title: 'Viewing user ' + req.user.name,
    user: req.user
  });
};

exports.edit = function(req, res){
  res.render('users/edit', {
    title: 'Editing user ' + req.user.name,
    user: req.user
  });
};

exports.update = function(req, res){
  // Validate and sanitize user input
  var user = req.body.user || {};
  
  // Validate name (non-empty string)
  var name = user.name;
  if (typeof name !== 'string' || name.trim() === '') {
    var err = new Error('Invalid name provided');
    err.status = 400;
    return next(err);
  }
  
  // Validate email (non-empty string with basic email format)
  var email = user.email;
  if (typeof email !== 'string' || email.trim() === '' || 
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    var err = new Error('Invalid email provided');
    err.status = 400;
    return next(err);
  }
  
  // Sanitize inputs to prevent injection
  name = name.trim();
  email = email.trim();
  
  // Update user information
  req.user.name = name;
  req.user.email = email;
  
  res.redirect(req.get('Referrer') || '/');
};