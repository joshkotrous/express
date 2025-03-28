'use strict'

/**
 * Module dependencies.
 */

var cookieSession = require('cookie-session');
var express = require('../../');
var crypto = require('crypto'); // Standard Node.js module

var app = module.exports = express();

// In a production application, session secrets should be:
// 1. Set via environment variables (not hardcoded)
// 2. Strong, random values
// 3. At least 32 characters long
// 4. Changed periodically
const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  console.warn('WARNING: No SESSION_SECRET environment variable set.');
  console.warn('Using a generated secret. Sessions will not persist across application restarts.');
  console.warn('For production, set a strong, random SESSION_SECRET environment variable.');
}

// add req.session cookie support
app.use(cookieSession({ 
  secret: sessionSecret || crypto.randomBytes(32).toString('hex') 
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