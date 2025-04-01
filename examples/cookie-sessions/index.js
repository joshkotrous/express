'use strict'

/**
 * Module dependencies.
 */

var cookieSession = require('cookie-session');
var express = require('../../');

var app = module.exports = express();

// Use environment variable for session secret
const sessionSecret = process.env.SESSION_SECRET;

// Warn if no session secret is provided
if (!sessionSecret) {
  console.warn(
    'Warning: SESSION_SECRET environment variable not set. Using default secret. ' +
    'This is insecure and should not be used in production.'
  );
}

// add req.session cookie support
app.use(cookieSession({ 
  secret: sessionSecret || 'manny is cool' // Only use default as fallback
}));

// do something with the session
app.get('/', function (req, res) {
  req.session.count = (req.session.count || 0) + 1
  res.send('viewed ' + req.session.count + ' times\n')
})

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}