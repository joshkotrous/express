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
  var id = parseInt(req.params.id, 10); // Parse to integer with base 10
  
  // Check if id is a valid non-negative integer and within array bounds
  if (isNaN(id) || id < 0 || id >= users.length) {
    var err = new Error('Invalid user ID: ' + req.params.id);
    err.status = 404;
    return next(err);
  }
  
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
  // Normally you would handle all kinds of
  // validation and save back to the db
  var user = req.body.user;
  
  // Minimal validation to prevent security issues
  if (!user) {
    return res.status(400).send('User data is required');
  }
  
  // Ensure name is a non-empty string
  if (typeof user.name !== 'string' || user.name.trim() === '') {
    return res.status(400).send('Valid name is required');
  }
  
  // Ensure email is a string that looks like an email
  if (typeof user.email !== 'string' || !user.email.includes('@')) {
    return res.status(400).send('Valid email is required');
  }
  
  // Update user properties with sanitized input
  req.user.name = user.name.trim();
  req.user.email = user.email.trim();
  
  // Extract only the path component from Referrer to prevent open redirect attacks
  var referrer = req.get('Referrer');
  var redirectPath = '/';
  
  if (referrer) {
    // Extract path from the referrer URL
    var pathMatch = referrer.match(/^(https?:\/\/[^\/]+)?(\/.*)$/);
    if (pathMatch && pathMatch[2]) {
      // Basic safety check - ensure it starts with / and doesn't contain ..
      var path = pathMatch[2];
      if (path.startsWith('/') && !path.includes('..')) {
        redirectPath = path;
      }
    }
  }
  
  res.redirect(redirectPath);
};