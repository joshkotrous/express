'use strict'

// install redis first:
// https://redis.io/

// then:
// $ npm install redis
// $ redis-server

/**
 * Module dependencies.
 */

var express = require('../..');
var path = require('path');
var redis = require('redis');

var db = redis.createClient();

// npm install redis

var app = express();

app.use(express.static(path.join(__dirname, 'public')));

// populate search

db.sadd('ferret', 'tobi');
db.sadd('ferret', 'loki');
db.sadd('ferret', 'jane');
db.sadd('cat', 'manny');
db.sadd('cat', 'luna');

/**
 * GET search for :query.
 */

app.get('/search/:query?', function(req, res, next){
  var query = req.params.query;
  var allowedSets = ['ferret', 'cat']; // Whitelist of allowed set names
  
  if (!query) {
    return res.status(200).send([]); // Empty result if no query provided
  }
  
  if (!allowedSets.includes(query)) {
    return res.status(400).send('Invalid query parameter');
  }
  
  db.smembers(query, function(err, vals){
    if (err) return next(err);
    res.send(vals);
  });
});

/**
 * GET client javascript. Here we use sendFile()
 * because serving __dirname with the static() middleware
 * would also mean serving our server "index.js" and the "search.jade"
 * template.
 */

app.get('/client.js', function(req, res){
  res.sendFile(path.join(__dirname, 'client.js'));
});

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}