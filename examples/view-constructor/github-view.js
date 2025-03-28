'use strict'

/**
 * Module dependencies.
 */

var https = require('https');
var path = require('path');
var extname = path.extname;

/**
 * Expose `GithubView`.
 */

module.exports = GithubView;

/**
 * Custom view that fetches and renders
 * remove github templates. You could
 * render templates from a database etc.
 */

function GithubView(name, options){
  if (!name || typeof name !== 'string') {
    throw new Error('Template name must be a non-empty string');
  }
  
  // Validate the name parameter with a whitelist approach
  // Allow alphanumeric characters, underscores, hyphens, dots, and forward slashes
  if (!/^[a-zA-Z0-9_\-\.\/]+$/.test(name) || name.indexOf('..') !== -1) {
    throw new Error('Invalid template name');
  }
  
  this.name = name;
  options = options || {};
  this.engine = options.engines[extname(name)];
  
  // Sanitize the root option as well for completeness
  var root = options.root || '';
  if (!/^[a-zA-Z0-9_\-\.\/]+$/.test(root) || root.indexOf('..') !== -1) {
    throw new Error('Invalid root path');
  }
  
  // "root" is the app.set('views') setting, however
  // in your own implementation you could ignore this
  this.path = '/' + root + '/master/' + name;
}

/**
 * Render the view.
 */

GithubView.prototype.render = function(options, fn){
  var self = this;
  var opts = {
    host: 'raw.githubusercontent.com',
    port: 443,
    path: this.path,
    method: 'GET'
  };

  https.request(opts, function(res) {
    var buf = '';
    res.setEncoding('utf8');
    res.on('data', function(str){ buf += str });
    res.on('end', function(){
      self.engine(buf, options, fn);
    });
  }).end();
};