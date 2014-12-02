var passport = require('passport');
var Hashids = require('hashids');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

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

passport.use(new GoogleStrategy(secrets.google, function(req, accessToken, refreshToken, profile, done) {
  if (req.user) {
    User.findOne({ google: profile.id }, function(err, existingUser) {
      if (existingUser) {
        req.flash('errors', { msg: 'There is already a Google account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
        done(err);
      } else {
        User.findById(req.user.id, function(err, user) {
          user.google = profile.id;
          user.tokens.push({ kind: 'google', accessToken: accessToken });
          user.profile.avatar = user.profile.avatar || profile._json.picture;
          user.save(function(err) {
            req.flash('info', { msg: 'Google account has been linked.' });
            done(err, user);
          });
        });
      }
    });
  } else {
    User.findOne({ google: profile.id }, function(err, existingUser) {
      if (existingUser) return done(null, existingUser);
      User.findOne({ email: profile._json.email }, function(err, existingEmailUser) {
        if (existingEmailUser) {
          req.flash('errors', { msg: 'There is already an account using this email address. Sign in to that account and link it with Google manually from Account Settings.' });
          done(err);
        } else {
          var user = new User();
          user.email = profile._json.email;
          user.uid = profile._json.email.toLowerCase();
          user.username = profile._json.email;
          user.google = profile.id;
          user.tokens.push({ kind: 'google', accessToken: accessToken, email: profile._json.email });
          user.profile.avatar = profile._json.picture;
          user.save(function(err) {
            done(err, user);
          });
        }
      });
    });
  }
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
