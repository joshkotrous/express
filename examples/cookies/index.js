'use strict'

/**
 * Module dependencies.
 */

var express = require('../../');
var app = module.exports = express();
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var url = require('url');

// custom log format
if (process.env.NODE_ENV !== 'test') app.use(logger(':method :url'))

// Get cookie secret from environment variable
const cookieSecret = process.env.COOKIE_SECRET || 'my secret here';

// Warn if using default secret in non-test environment
if (cookieSecret === 'my secret here' && process.env.NODE_ENV !== 'test') {
  console.warn('Warning: Using default cookie secret. Set COOKIE_SECRET environment variable for better security.');
}

// parses request cookies, populating
// req.cookies and req.signedCookies
// when the secret is passed, used
// for signing the cookies.
app.use(cookieParser(cookieSecret));

// parses x-www-form-urlencoded
app.use(express.urlencoded())

// Helper function to safely get a redirect URL
function getSafeRedirectUrl(req) {
  var referrer = req.get('Referrer') || '/';
  
  // Already a relative URL, safe to use
  if (referrer.indexOf('/') === 0) {
    return referrer;
  }
  
  try {
    // Parse the URL
    var parsedUrl = url.parse(referrer);
    
    // Check if the hostname matches
    if (parsedUrl.hostname === req.get('host')) {
      return parsedUrl.path || '/';
    }
  } catch (e) {
    // If URL parsing fails, default to homepage
  }
  
  // Default to homepage for external or invalid URLs
  return '/';
}

app.get('/', function(req, res){
  if (req.cookies.remember) {
    res.send('Remembered :). Click to <a href="/forget">forget</a>!.');
  } else {
    res.send('<form method="post"><p>Check to <label>'
      + '<input type="checkbox" name="remember"/> remember me</label> '
      + '<input type="submit" value="Submit"/>.</p></form>');
  }
});

app.get('/forget', function(req, res){
  res.clearCookie('remember');
  res.redirect(getSafeRedirectUrl(req));
});

app.post('/', function(req, res){
  var minute = 60000;

  if (req.body && req.body.remember) {
    res.cookie('remember', 1, { maxAge: minute })
  }

  res.redirect(getSafeRedirectUrl(req));
});

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}