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

// Check if COOKIE_SECRET environment variable is set
if (!process.env.COOKIE_SECRET) {
  console.warn('WARNING: COOKIE_SECRET environment variable not set');
  
  // In production, require a proper secret
  if (process.env.NODE_ENV === 'production') {
    throw new Error('COOKIE_SECRET environment variable must be set in production environment');
  } else {
    console.warn('Using insecure default secret for development. DO NOT use in production!');
  }
}

// parses request cookies, populating
// req.cookies and req.signedCookies
// when the secret is passed, used
// for signing the cookies.
app.use(cookieParser(process.env.COOKIE_SECRET || 'insecure_dev_secret'));

// parses x-www-form-urlencoded
app.use(express.urlencoded())

app.get('/', function(req, res){
  if (req.cookies.remember) {
    res.send('Remembered :). <form method="post" action="/forget" style="display:inline;"><input type="submit" value="Forget"></form>');
  } else {
    res.send('<form method="post"><p>Check to <label>'
      + '<input type="checkbox" name="remember"/> remember me</label> '
      + '<input type="submit" value="Submit"/>.</p></form>');
  }
});

app.post('/forget', function(req, res){
  res.clearCookie('remember', { httpOnly: true, secure: true });
  res.redirect(req.get('Referrer') || '/');
});

app.post('/', function(req, res){
  var minute = 60000;

  if (req.body && req.body.remember) {
    res.cookie('remember', 1, { maxAge: minute, httpOnly: true, secure: true })
  }

  res.redirect(req.get('Referrer') || '/');
});

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}