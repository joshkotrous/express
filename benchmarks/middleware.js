
var express = require('..');
var app = express();
const MAX_MIDDLEWARE = 100; // Maximum allowed middleware functions
var middlewareCount = parseInt(process.env.MW || '1', 10);

// Validate middleware count is within acceptable bounds
if (isNaN(middlewareCount) || middlewareCount < 1) {
    middlewareCount = 1;
} else if (middlewareCount > MAX_MIDDLEWARE) {
    middlewareCount = MAX_MIDDLEWARE;
}

console.log('  %s middleware', middlewareCount);
while (middlewareCount--) {
  app.use(function(req, res, next){
    next();
  });
}
    next();
  });
}

app.use(function(req, res){
  res.send('Hello World')
});

app.listen(3333);
