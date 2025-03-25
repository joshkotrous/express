'use strict'

/**
 * Module dependencies.
 */

var express = require('../../');
var path = require('path');

var app = module.exports = express();

// path to where the files are stored on disk
var FILES_DIR = path.join(__dirname, 'files')

app.get('/', function(req, res){
  res.send('<ul>' +
    '<li>Download <a href="/files/notes/groceries.txt">notes/groceries.txt</a>.</li>' +
    '<li>Download <a href="/files/amazing.txt">amazing.txt</a>.</li>' +
    '<li>Download <a href="/files/missing.txt">missing.txt</a>.</li>' +
    '<li>Download <a href="/files/CCTV大赛上海分赛区.txt">CCTV大赛上海分赛区.txt</a>.</li>' +
    '</ul>')
});

// /files/* is accessed via req.params[0]
// but here we name it :file
app.get('/files/*file', function (req, res, next) {
  // Get the file path from the request parameters
  let filePath = req.params.file;
  if (Array.isArray(filePath)) {
    filePath = filePath.join('/');
  }
  
  // Decode the URL to handle URL-encoded characters
  const decodedPath = decodeURIComponent(filePath);
  
  // Use path.resolve() to get the absolute paths
  const requestedAbsolutePath = path.resolve(FILES_DIR, decodedPath);
  const rootAbsolutePath = path.resolve(FILES_DIR);
  
  // Check if the resolved path is outside the FILES_DIR directory
  if (!requestedAbsolutePath.startsWith(rootAbsolutePath)) {
    // If the path tries to traverse outside the FILES_DIR, deny access
    return res.status(403).send('Forbidden');
  }
  
  // If the path is safe, proceed with the download
  res.download(filePath, { root: FILES_DIR }, function (err) {
    if (!err) return; // file sent
    if (err.status !== 404) return next(err); // non-404 error
    // file for download not found
    res.statusCode = 404;
    res.send('Cant find that file, sorry!');
  });
});

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}