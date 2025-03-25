'use strict'

/**
 * Module dependencies.
 */

var express = require('../../');

var app = module.exports = express();

// Ad-hoc example resource method

app.resource = function(path, obj) {
  this.get(path, obj.index);
  this.get(path + '/:a..:b{.:format}', function(req, res){
    var a = parseInt(req.params.a, 10);
    var b = parseInt(req.params.b, 10);
    
    // Validate that the parsed values are valid numbers
    if (isNaN(a) || isNaN(b) || !isFinite(a) || !isFinite(b)) {
      return res.status(400).send({ error: 'Invalid range parameters. Both a and b must be valid integers.' });
    }
    
    // Validate that the indices are not negative
    if (a < 0 || b < 0) {
      return res.status(400).send({ error: 'Invalid range parameters. Both a and b must be non-negative integers.' });
    }
    
    var format = req.params.format;
    obj.range(req, res, a, b, format);
  });
  this.get(path + '/:id', obj.show);
  this.delete(path + '/:id', function(req, res){
    var id = parseInt(req.params.id, 10);
    
    // Validate that the parsed id is a valid number
    if (isNaN(id) || !isFinite(id)) {
      return res.status(400).send({ error: 'Invalid id parameter. Must be a valid integer.' });
    }
    
    obj.destroy(req, res, id);
  });
};

// Fake records

var users = [
  { name: 'tj' }
  , { name: 'ciaran' }
  , { name: 'aaron' }
  , { name: 'guillermo' }
  , { name: 'simon' }
  , { name: 'tobi' }
];

// Fake controller.

var User = {
  index: function(req, res){
    res.send(users);
  },
  show: function(req, res){
    var id = parseInt(req.params.id, 10);
    
    // Validate that the parsed id is a valid number
    if (isNaN(id) || !isFinite(id)) {
      return res.send({ error: 'Invalid user id' });
    }
    
    res.send(users[id] || { error: 'Cannot find user' });
  },
  destroy: function(req, res, id){
    var destroyed = id in users;
    delete users[id];
    res.send(destroyed ? 'destroyed' : 'Cannot find user');
  },
  range: function(req, res, a, b, format){
    var range = users.slice(a, b + 1);
    switch (format) {
      case 'json':
        res.send(range);
        break;
      case 'html':
      default:
        var html = '<ul>' + range.map(function(user){
          return '<li>' + user.name + '</li>';
        }).join('\n') + '</ul>';
        res.send(html);
        break;
    }
  }
};

// curl http://localhost:3000/users     -- responds with all users
// curl http://localhost:3000/users/1   -- responds with user 1
// curl http://localhost:3000/users/4   -- responds with error
// curl http://localhost:3000/users/1..3 -- responds with several users
// curl -X DELETE http://localhost:3000/users/1  -- deletes the user

app.resource('/users', User);

app.get('/', function(req, res){
  res.send([
    '<h1>Examples:</h1> <ul>'
    , '<li>GET /users</li>'
    , '<li>GET /users/1</li>'
    , '<li>GET /users/3</li>'
    , '<li>GET /users/1..3</li>'
    , '<li>GET /users/1..3.json</li>'
    , '<li>DELETE /users/4</li>'
    , '</ul>'
  ].join('\n'));
});

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}