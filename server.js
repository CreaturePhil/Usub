var bodyParser = require('body-parser');
var compress = require('compression');
var connectMongo = require('connect-mongo');
var errorhandler = require('errorhandler');
var express = require('express');
var expressValidator = require('express-validator');
var favicon = require('serve-favicon');
var flash = require('express-flash');
var lusca = require('lusca');
var methodOverride = require('method-override');
var moment = require('moment');
var mongoose = require('mongoose');
var morgan = require('morgan');
var passport = require('passport');
var path = require('path');
var session = require('express-session');

var csp = require('./lib/csp');
var routes = require('./config/routes');
var secrets = require('./config/secrets');
var validators = require('./lib/validators');

var app = express();

/**
 * Connect to MongoDB.
 */

mongoose.connect(secrets.db);
mongoose.connection.on('error', function() {
  console.error('MongoDB Connection Error. Make sure MongoDB is running.');
});

/** 
 * App configuration
 */ 

// view engine setup
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'jade');

if (app.get('env') === 'development') {
  // don't minify html
  app.locals.pretty = true;

  // turn on console logging
  app.use(morgan('dev'));
}

var week = 604800000;

var MongoStore = connectMongo({ session: session });

var sess = {
  resave: false,
  saveUninitialized: false,
  secret: secrets.session,
  cookie: {
    httpOnly: true,
    maxAge: week 
  },
  store: new MongoStore({
    url: secrets.db,
    auto_reconnect: true
  })
};

if (app.get('env') === 'production') {
  app.use(lusca.csp(csp));
  app.use(lusca.xframe('DENY'));
  app.use(lusca.p3p('ABCDEF'));
  app.use(lusca.hsts({ maxAge: 7776000000 })); // 90 days
  app.use(lusca.xssProtection(true));
  app.set('trust proxy', 1); // trust first proxy
}

app.use(compress());
app.use(favicon(__dirname + '/public/favicon.ico', { maxAge: week }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());
app.use(expressValidator({ customValidators: validators }));
app.use(session(sess));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(lusca.csrf());

/**
 * Make local variables avaliable in templates.
 */

app.locals.env = app.get('env');
app.locals.moment = moment;
app.use(function(req, res, next) {
  res.locals.baseUrl = req.protocol + '://' + req.get('host') + '/';
  res.locals.user = req.user;
  next();
});

// static cache for one week
app.use(express.static(path.join(__dirname, 'public'), { maxAge: week }));

// routes setup
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Page Not Found');
  err.status = 404;
  next(err);
});

/**
 * Error handlers
 */

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(errorhandler());
}

// production error handler
// no stacktraces leaked to user
if (app.get('env') === 'production') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      title: 'Page not found',
      message: err.message
    });
  });
}

module.exports = app;
