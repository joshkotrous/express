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
  var id = parseInt(req.params.id, 10);
  
  // Validate the id is a valid number and within bounds
  if (isNaN(id) || id < 0 || id >= users.length) {
    var err = new Error('Invalid user ID: ' + req.params.id);
    err.status = 400;  // Bad Request
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
  
  // Basic validation
  if (!user) {
    return res.status(400).send('User data is required');
  }
  
  // Validate name
  if (!user.name || typeof user.name !== 'string') {
    return res.status(400).send('Valid name is required');
  }
  
  // Validate email
  if (!user.email || typeof user.email !== 'string' || !user.email.includes('@')) {
    return res.status(400).send('Valid email is required');
  }
  
  // Update user after validation
  req.user.name = user.name;
  req.user.email = user.email;
  
  // Simple safe redirect approach - only accept internal paths
  var referrer = req.get('Referrer') || '/';
  if (referrer.indexOf('://') !== -1 || referrer.indexOf('//') === 0) {
    referrer = '/';
  }
  
  res.redirect(referrer);
};