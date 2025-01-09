'use strict'

// install redis first:
// https://redis.io/

// then:
// $ npm install redis
// $ redis-server

var express = require('../..');
var session = require('express-session');
var dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Ensure session secret is set
if (!process.env.SESSION_SECRET) {
  console.error('SESSION_SECRET environment variable must be set');
  process.exit(1);
}

var app = express();

// Populates req.session
app.use(session({
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: process.env.SESSION_SECRET
}));

app.get('/', function(req, res){
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

  var body = '';
  if (req.session.views) {
    ++req.session.views;
    body = '';