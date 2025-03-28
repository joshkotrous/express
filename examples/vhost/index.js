'use strict'

/**
 * Module dependencies.
 */

var express = require('../..');
var logger = require('morgan');
var vhost = require('vhost');

/*
edit /etc/hosts:

127.0.0.1       foo.example.com
127.0.0.1       bar.example.com
127.0.0.1       example.com
*/

// Main server app

var main = express();

if (!module.parent) main.use(logger('dev'));

main.get('/', function(req, res){
  res.send('Hello from main app!');
});

main.get('/:sub', function(req, res){
  res.send('requested ' + req.params.sub);
});

// Redirect app

var redirect = express();

redirect.use(function(req, res){
  if (!module.parent) console.log(req.vhost);
  
  // Sanitize the subdomain value to prevent open redirect
  var subdomain = req.vhost[0];
  
  // Validate subdomain - only allow alphanumeric characters, hyphens, and underscores
  if (subdomain && /^[a-zA-Z0-9-_]+$/.test(subdomain)) {
    res.redirect('http://example.com:3000/' + subdomain);
  } else {
    // If validation fails, redirect to the root URL
    res.redirect('http://example.com:3000/');
  }
});

// Vhost app

var app = module.exports = express();

app.use(vhost('*.example.com', redirect)); // Serves all subdomains via Redirect app
app.use(vhost('example.com', main)); // Serves top level domain via Main server app

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}