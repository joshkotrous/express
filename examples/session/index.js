'use strict'

// install redis first:
// https://redis.io/

// then:
// $ npm install redis
// $ redis-server

var express = require('../..');
var session = require('express-session');

var app = express();

// Get session secret from environment variable or use a default for development
var sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  // Only use default in development, not suitable for production
  if (process.env.NODE_ENV === 'production') {
    console.error('Warning: SESSION_SECRET is not set in production environment!');
    console.error('This is a significant security risk. Set the SESSION_SECRET environment variable.');
  }
  sessionSecret = 'keyboard cat'; // Default for development only
}

// Populates req.session
app.use(session({
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: sessionSecret
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