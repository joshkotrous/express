'use strict'

/**
 * Module dependencies.
 */

var express = require('../../');
var app = module.exports = express();
var logger = require('morgan');
var cookieParser = require('cookie-parser');

// custom log format
if (process.env.NODE_ENV !== 'test') app.use(logger(':method :url'))

// Get cookie secret from environment variable or generate a secure random one as fallback
const cookieSecret = process.env.COOKIE_SECRET || 
  (function() {
    // Only show warning in non-test environments
    if (process.env.NODE_ENV !== 'test') {
      console.warn('WARNING: No COOKIE_SECRET environment variable set. Using a random generated value. This is less secure for production use.');
    }
    // Generate random string as fallback
    return require('crypto').randomBytes(32).toString('hex');
  })();

// parses request cookies, populating
// req.cookies and req.signedCookies
// when the secret is passed, used
// for signing the cookies.
app.use(cookieParser(cookieSecret));

// parses x-www-form-urlencoded
app.use(express.urlencoded())

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
  res.redirect(req.get('Referrer') || '/');
});

app.post('/', function(req, res){
  var minute = 60000;

  if (req.body && req.body.remember) {
    res.cookie('remember', 1, { maxAge: minute })
  }

  res.redirect(req.get('Referrer') || '/');
});

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}