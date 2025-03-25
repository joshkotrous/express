'use strict'

/**
 * Module dependencies.
 */

var express = require('../..');
var path = require('path');
var app = express();
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var site = require('./site');
var post = require('./post');
var user = require('./user');

module.exports = app;

// Config

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/* istanbul ignore next */
if (!module.parent) {
  app.use(logger('dev'));
}

// Define allowed methods for override
var allowedMethods = ['PUT', 'DELETE', 'PATCH'];

// Replace simple methodOverride with a more restricted version
app.use(methodOverride(function(req) {
  // Only allow overriding from POST requests
  if (req.method.toLowerCase() !== 'post') {
    return;
  }
  
  // Check for _method in query string
  if (req.query && req.query._method) {
    var method = req.query._method.toUpperCase();
    if (allowedMethods.indexOf(method) !== -1) {
      return method;
    }
  }
  
  // Check for X-HTTP-Method-Override header
  if (req.headers['x-http-method-override']) {
    var method = req.headers['x-http-method-override'].toUpperCase();
    if (allowedMethods.indexOf(method) !== -1) {
      return method;
    }
  }
  
  // No valid override found
  return;
}));

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')));

// General

app.get('/', site.index);

// User

app.get('/users', user.list);
app.all('/user/:id{/:op}', user.load);
app.get('/user/:id', user.view);
app.get('/user/:id/view', user.view);
app.get('/user/:id/edit', user.edit);
app.put('/user/:id/edit', user.update);

// Posts

app.get('/posts', post.list);

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}