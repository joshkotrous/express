var express = require('..');
var app = express();

// number of middleware

const MAX_MIDDLEWARE = 100; // Set a reasonable maximum
var raw = parseInt(process.env.MW || '1', 10);
var n = (isNaN(raw) || raw <= 0 || raw > MAX_MIDDLEWARE) ? 1 : raw;
console.log('  %s middleware', n);

while (n--) {
  app.use(function(req, res, next){
    next();
  });
}

app.use(function(req, res){
  res.send('Hello World')
});

app.listen(3333);