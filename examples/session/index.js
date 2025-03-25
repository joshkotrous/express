'use strict'

// install redis first:
// https://redis.io/

// then:
// $ npm install redis
// $ redis-server

var express = require('../..');
var session = require('express-session');

var app = express();

// SECURITY BEST PRACTICE: Use environment variables for session secrets
// For production, set SESSION_SECRET environment variable to a strong random value
// Example: export SESSION_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret && process.env.NODE_ENV === 'production') {
  console.error('WARNING: SESSION_SECRET environment variable not set in production!');
  console.error('This is a security risk. Please set a strong SESSION_SECRET.');
}

// Populates req.session
app.use(session({
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: sessionSecret || 'keyboard cat' // Fallback for development only - DO NOT USE IN PRODUCTION
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