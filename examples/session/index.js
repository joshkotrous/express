'use strict'
// install redis first:
// https://redis.io/
// then:
// $ npm install redis
// $ redis-server
var express = require('../..');
var session = require('express-session');
const crypto = require('crypto');
var app = express();
// session support
app.use(session({
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: process.env.SESSION_SECRET || (() => {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('SESSION_SECRET environment variable must be set in production');
    }
    console.warn('WARNING: Using default session secret. This is insecure in production.');
    return crypto.randomBytes(32).toString('hex');
  })()
}));
app.get('/', function(req, res){
  var body = '';
  if (req.session.views) {
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
