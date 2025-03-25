'use strict'

// install redis first:
// https://redis.io/

// then:
// $ npm install redis
// $ redis-server

var express = require('../..');
var session = require('express-session');

var app = express();

// Use environment variable for session secret or fallback with warning
const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  console.warn('WARNING: No SESSION_SECRET environment variable set. Using default secret. This is not secure for production!');
}

// Populates req.session
app.use(session({
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: sessionSecret || 'keyboard cat' // Use environment variable or fallback
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