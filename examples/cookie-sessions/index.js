'use strict'

/**
 * Module dependencies.
 */

var cookieSession = require('cookie-session');
var express = require('../../');

var app = module.exports = express();

// Get session secret from environment variable
// For security, always set SESSION_SECRET to a strong random value in production
var sessionSecret = process.env.SESSION_SECRET;

// Enforce secure configuration in production
if (process.env.NODE_ENV === 'production' && !sessionSecret) {
  console.error('ERROR: SESSION_SECRET environment variable must be set in production');
  process.exit(1);
}

// Use a default secret only for non-production environments
if (!sessionSecret) {
  console.warn('WARNING: Using default session secret. This is only acceptable for development/testing.');
  // The default includes some runtime variables to avoid having a truly hardcoded value
  sessionSecret = 'dev-secret-' + process.pid + '-' + Date.now();
}

// add req.session cookie support
app.use(cookieSession({ secret: sessionSecret }));

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