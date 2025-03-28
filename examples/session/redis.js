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

// Get session secret from environment variable with fallback for development
const sessionSecret = process.env.SESSION_SECRET || 'keyboard cat';
// Show warning if using default secret in production
if (process.env.NODE_ENV === 'production' && !process.env.SESSION_SECRET) {
  console.warn('WARNING: No SESSION_SECRET environment variable set in production mode! Using default secret which is insecure.');
}

// Populates req.session
app.use(session({
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: sessionSecret,
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