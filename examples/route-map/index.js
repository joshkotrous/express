'use strict'

/**
 * Module dependencies.
 */

var escapeHtml = require('escape-html')
var express = require('../../lib/express');

var verbose = process.env.NODE_ENV !== 'test'

var app = module.exports = express();

app.map = function(a, route){
  route = route || '';
  for (var key in a) {
    switch (typeof a[key]) {
      // { '/path': { ... }}
      case 'object':
        app.map(a[key], route + key);
        break;
      // get: function(){ ... }
      case 'function':
        if (verbose) console.log('%s %s', key, route);
        app[key](route, a[key]);
        break;
    }
  }
};

// Authentication and authorization wrapper
function secureHandler(handler, requiresAuth = true, requiresUserOwnership = false) {
  return function(req, res) {
    // Check for authentication if required
    if (requiresAuth) {
      const authHeader = req.get('Authorization');
      if (!authHeader) {
        return res.status(401).send('Authentication required');
      }
      
      // Mock user for demonstration
      req.user = { 
        id: 'user-id', 
        role: authHeader.includes('admin') ? 'admin' : 'user' 
      };
      
      // Check authorization if required
      if (requiresUserOwnership && req.params.uid && 
          req.user.role !== 'admin' && req.user.id !== req.params.uid) {
        return res.status(403).send('Unauthorized for this operation');
      }
    }
    
    // Call the original handler
    handler(req, res);
  };
}

var users = {
  list: function(req, res){
    res.send('user list');
  },

  get: function(req, res){
    res.send('user ' +  escapeHtml(req.params.uid))
  },

  delete: function(req, res){
    res.send('delete users');
  }
};

var pets = {
  list: function(req, res){
    res.send('user ' + escapeHtml(req.params.uid) + '\'s pets')
  },

  delete: function(req, res){
    res.send('delete ' + escapeHtml(req.params.uid) + '\'s pet ' + escapeHtml(req.params.pid))
  }
};

// Secure the handlers
var secureUsers = {
  list: secureHandler(users.list, false), // Public endpoint, no auth needed
  get: secureHandler(users.get, true, true), // Requires auth and ownership
  delete: secureHandler(users.delete, true, true) // Requires auth and ownership
};

var securePets = {
  list: secureHandler(pets.list, true, true), // Requires auth and ownership
  delete: secureHandler(pets.delete, true, true) // Requires auth and ownership
};

app.map({
  '/users': {
    get: secureUsers.list,
    delete: secureUsers.delete,
    '/:uid': {
      get: secureUsers.get,
      '/pets': {
        get: securePets.list,
        '/:pid': {
          delete: securePets.delete
        }
      }
    }
  }
});

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}