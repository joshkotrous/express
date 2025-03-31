'use strict'

/**
 * Module dependencies.
 */

var express = require('../..');
var logger = require('morgan');
var session = require('express-session');
var crypto = require('crypto');

// pass the express to the connect redis module
// allowing it to inherit from session.Store
var RedisStore = require('connect-redis')(session);

var app = express();

app.use(logger('dev'));

// Get session secret from environment variable or generate a random one
const sessionSecret = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');

// If no environment variable was set, warn the user
if (!process.env.SESSION_SECRET) {
  console.warn('WARNING: SESSION_SECRET environment variable not set. Using a random secret for this session. This is not suitable for production environments.');
}

// Populates req.session
app.use(session({
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: sessionSecret,
  store: new RedisStore,
  cookie: {
    domain: process.env.COOKIE_DOMAIN || 'localhost' // Set the domain for the cookie
  }
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