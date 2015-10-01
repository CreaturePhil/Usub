var Hashids = require('hashids');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var mongoose = require('mongoose');

var secrets = require('../../config/secrets');

var hashids = new Hashids(secrets.hash);

var userSchema = new mongoose.Schema({
  uid: { type: String, unique: true, lowercase: true },
  username: { type: String, unique: true },
  email: { type: String, unique: true, lowercase: true },
  password: String,
  subscriptions: Array,
  videolimit: {
    times: { type: Array, default: ['second', 'minute', 'hour', 'day', 'week'] },
    time: { type: String, default: 'week' },
    amount: { type: Number, default: 1 },
    limit: { type: String, default: '2 weeks' }
  },

  profile: {
    avatar: { type: String, default: '' },
    bio: { type: String, default: '' },
    joinDate: { type: Date, default: Date.now() },
    location: { type: String, default: '' },
    website: { type: String, default: '' },
  },

  resetPasswordToken: String,
  resetPasswordExpires: Date
});

/**
 * Hash the password for security.
 * "Pre" is a Mongoose middleware that executes before each user.save() call.
 */

userSchema.pre('save', function(next) {
  var user = this;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

/**
 * Validate user's password.
 * Used by Passport-Local Strategy for password validation.
 */

userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

/**
 * Get hash id of the user.
 * Used in user's api.
 */

userSchema.methods.getHash = function() {
  return hashids.encodeHex(this._id);
};

/**
 * Get URL to a user's gravatar.
 * Used in Navbar and Account Management page.
 */

userSchema.methods.gravatar = function(size) {
  if (!size) size = 200;

  var md5 = crypto.createHash('md5').update(this.email).digest('hex');
  return 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '&d=retro';
};

module.exports = mongoose.model('user', userSchema);
