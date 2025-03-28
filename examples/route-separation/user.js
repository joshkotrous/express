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
  
  // Check if id is a valid non-negative integer and within array bounds
  if (isNaN(id) || id < 0 || id >= users.length) {
    var err = new Error('Invalid user ID: ' + req.params.id);
    err.status = 404;
    next(err);
    return;
  }
  
  req.user = users[id];
  next();
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
// Helper function to sanitize input
function sanitizeInput(input) {
  if (typeof input !== 'string') {
    return '';
  }
  // Simple sanitization: remove potentially dangerous content and trim
  
  // Get the referrer
  const referrer = req.get('Referrer');
  
  // Default redirect location
  let redirectUrl = '/';
  
  if (referrer) {
    // Check if the referrer is from the same origin by checking the host
    const host = req.get('host');
    const sameOriginRegex = new RegExp(`^https?://${host}`, 'i');
    
    if (sameOriginRegex.test(referrer)) {
      // Extract just the path and query parts
      const pathMatch = referrer.match(/^https?:\/\/[^\/]+(\/.*)$/);
      if (pathMatch) {
        redirectUrl = pathMatch[1];
      }
    }
  }
  
  res.redirect(redirectUrl);
};
  // Sanitize inputs
  var sanitizedName = sanitizeInput(user.name);
  var sanitizedEmail = sanitizeInput(user.email);
  
  // Validate inputs
  if (sanitizedName && isValidEmail(sanitizedEmail)) {
    // Only update with valid data
    req.user.name = sanitizedName;
    req.user.email = sanitizedEmail;
  }
  
  res.redirect(req.get('Referrer') || '/');
};