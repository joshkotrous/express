'use strict'

/**
 * Module dependencies.
 */

var express = require('../..');
var logger = require('morgan');
var session = require('express-session');

// pass the express to the connect redis module
// allowing it to inherit from session.Store
var RedisStore = require('connect-redis')(session);

var app = express();

app.use(logger('dev'));

// Get session secret from environment variable
const sessionSecret = process.env.SESSION_SECRET;

// In production, session secret is required
if (process.env.NODE_ENV === 'production' && !sessionSecret) {
  console.error('Error: SESSION_SECRET environment variable must be set in production.');
  process.exit(1);
} else if (!sessionSecret) {
  // In development, warn about missing session secret
  console.warn(
    'Warning: SESSION_SECRET not set in environment. Using a fallback secret for development only.\n' +
    'For production, use a strong, unique secret set via environment variable.'
  );
}

// Populates req.session
app.use(session({
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: sessionSecret || 'dev-environment-secret-a6f791e9e560e415', // Fallback for development
  store: new RedisStore
}));

app.get('/', function(req, res){
  var body = '';
  if (req.session.views) {
    ++req.session.views;
  } else {
    req.session.views = 1;
    body += '<p>First time visiting? view this page in several browsers :)</p>';
  }
  res.send(body + '<p>viewed <strong>' + req.session.views + '</strong> times.</p>');
});

app.listen(3000);
console.log('Express app started on port 3000');