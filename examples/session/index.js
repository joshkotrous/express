'use strict'

// install redis first:
// https://redis.io/

// then:
// $ npm install redis
// $ redis-server

var express = require('../..');
var session = require('express-session');

var app = express();

// Determine session secret from environment variables
var sessionSecret = process.env.SESSION_SECRET || 'keyboard cat';

// Warn if in production and using the default secret
if (process.env.NODE_ENV === 'production' && !process.env.SESSION_SECRET) {
  console.warn('WARNING: Using default session secret in production environment. This is insecure! Please set SESSION_SECRET environment variable.');
}

// Determine if we're in a production environment
var isProduction = process.env.NODE_ENV === 'production';

// Populates req.session
app.use(session({
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: sessionSecret,
  cookie: {
    // Set secure cookies in production (HTTPS)
    secure: isProduction,
    // Makes cookies inaccessible via client-side JavaScript
    httpOnly: true,
    // Use same-site cookies to prevent CSRF attacks
    sameSite: 'lax'
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

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}