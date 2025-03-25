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
    throw new Error('Invalid template name');
  }
  
  this.name = name;
  options = options || {};
  this.engine = options.engines[extname(name)];
  
  // Secure this.path construction
  
  // 1. Sanitize repository path (options.root)
  const safeRoot = options.root ? 
    String(options.root)
      .replace(/\.\./g, '') // Remove potential directory traversal
      .replace(/^\/+/, '')   // Remove leading slashes
      .replace(/\/+$/, '')   // Remove trailing slashes
    : '';
  
  // 2. Sanitize template name
  const safeName = String(name)
    .replace(/\.\./g, '')   // Remove potential directory traversal
    .replace(/^\/+/, '');    // Remove leading slashes
  
  // 3. Construct safe path
  this.path = '/' + safeRoot + '/master/' + safeName;
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