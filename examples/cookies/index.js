'use strict'

/**
 * Module dependencies.
 */

var express = require('../../');
var app = module.exports = express();
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var crypto = require('crypto'); // Node.js built-in for CSRF token

// Generate a CSRF token
function generateCSRFToken() {
  return crypto.randomBytes(16).toString('hex');
}

// custom log format
if (process.env.NODE_ENV !== 'test') app.use(logger(':method :url'))
}
// parses request cookies, populating
// req.cookies and req.signedCookies
// when the secret is passed, used
// for signing the cookies.
app.use(cookieParser('my secret here'));

// parses x-www-form-urlencoded
app.use(express.urlencoded())

app.get('/', function(req, res){
  // Generate a CSRF token
  const csrfToken = generateCSRFToken();
  res.cookie('csrf_token', csrfToken, { httpOnly: true, sameSite: 'strict' });
  
  if (req.cookies.remember) {
    res.send('Remembered :). Click to <a href="/forget">forget</a>!.');
  } else {
    res.send('<form method="post"><p>Check to <label>'
      + '<input type="checkbox" name="remember"/> remember me</label> '
      + '<input type="submit" value="Submit"/>.</p>'
      + '<input type="hidden" name="_csrf" value="' + csrfToken + '"/>'
      + '</form>');
    res.cookie('remember', 1, { maxAge: minute, httpOnly: true, secure: true })
});
  res.redirect(redirectUrl);
app.get('/forget', function(req, res){
  res.clearCookie('remember');
  res.redirect(req.get('Referrer') || '/');
});

app.post('/', function(req, res){
  var minute = 60000;

  // Verify CSRF token
  const requestToken = req.body && req.body._csrf;
  const cookieToken = req.cookies && req.cookies.csrf_token;
  
  if (!requestToken || !cookieToken || requestToken !== cookieToken) {
    return res.status(403).send('CSRF token validation failed');
  }

  if (req.body && req.body.remember) {
    res.cookie('remember', 1, { 
      maxAge: minute,
      sameSite: 'strict',
      httpOnly: true
    })
  }

  res.redirect(req.get('Referrer') || '/');
});

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}