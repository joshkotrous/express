'use strict'

/**
 * Module dependencies.
 */

var cookieSession = require('cookie-session');
var express = require('../../');

var app = module.exports = express();

// Get session secret from environment variable
// IMPORTANT: In production environments, always set the SESSION_SECRET 
// environment variable with a strong random value
const sessionSecret = process.env.SESSION_SECRET || 'EXAMPLE_SECRET_CHANGE_IN_PRODUCTION';

// Display warning if using the default insecure secret
if (!process.env.SESSION_SECRET) {
  console.warn('WARNING: Using insecure default session secret.');
  console.warn('For production use, set SESSION_SECRET environment variable with a strong random value.');
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