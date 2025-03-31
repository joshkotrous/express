'use strict'

/**
 * Module dependencies.
 */

var cookieSession = require('cookie-session');
var express = require('../../');
var crypto = require('crypto'); // Node.js built-in module

var app = module.exports = express();

// Get session secret from environment variable
var sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  console.warn('WARNING: No SESSION_SECRET environment variable set. Using a generated secret for development. This is not secure for production use.');
  // Generate a more secure random secret
  sessionSecret = crypto.randomBytes(32).toString('hex');
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