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
  
  this.name = name;
  options = options || {};
  
  if (!options.root || typeof options.root !== 'string') {
    throw new Error('options.root must be a non-empty string');
  }
  
  this.engine = options.engines[extname(name)];
  
  // Validate and sanitize GitHub repository path (options.root)
  const sanitizedRoot = options.root
    .replace(/^\//g, '')     // Remove leading slashes
    .replace(/\/$/g, '')     // Remove trailing slashes
    .replace(/\/+/g, '/');   // Ensure only single slashes
  
  // Check for path traversal attempts in root
  if (sanitizedRoot.includes('..')) {
    throw new Error('Invalid repository path');
  }
  
  // Validate GitHub repository path format (username/repository)
  const rootParts = sanitizedRoot.split('/');
  if (rootParts.length !== 2 || !rootParts[0] || !rootParts[1]) {
    throw new Error('Repository path must be in format "username/repository"');
  }
  
  // Sanitize template file path (name)
  // Remove any leading slash
  let safeName = name.replace(/^\/+/, '');
  
  // Detect and prevent path traversal attempts
  if (safeName.includes('..')) {
    throw new Error('Invalid template path: directory traversal attempts are not allowed');
  }
  
  // Construct the GitHub raw content URL path
  this.path = '/' + sanitizedRoot + '/master/' + safeName;
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