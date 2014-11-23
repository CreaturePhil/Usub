var passport = require('passport');
var Hashids = require('hashids');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../app/models/user');
var secrets = require('./secrets');

var hashids = new Hashids(secrets.hash);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// Sign in using username and password.
passport.use(new LocalStrategy({ usernameField: 'username' }, function(username, password, done) {
  User.findOne({ uid: username.toLowerCase() }, function(err, user) {
    if (!user) return done(null, false, { message: 'User ' + username + ' not found'});
    user.comparePassword(password, function(err, isMatch) {
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Invalid username or password.' });
      }
    });
  });
}));

// Login required middleware.
exports.isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
};

// Login required middleware.
exports.isUser = function(req, res, next) {
  if (req.user.getHash() === req.params.id) return next();
  res.status(500).json({ error: 'Access denied.' });
};
