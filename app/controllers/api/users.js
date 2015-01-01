var async = require('async');
var Hashids = require('hashids');

var secrets = require('../../../config/secrets');
var User = require('../../models/user');

var hashids = new Hashids(secrets.hash);

module.exports = {

  index: function(req, res, next) {
    User.find({}, function(err, users) {
      if (err) return next(err);
      async.map(users, function(userModel, cb) {
        user = userModel.toObject();
        user._id = userModel.getHash();
        user.subscriptions.sort(function(a, b) {
          return b.toLowerCase() < a.toLowerCase();
        });
        remove(user, 'email', 'password', '__v', 'resetPasswordToken', 'resetPasswordExpires');
        cb(null, user);
      }, function(err, results) {
        if (err) return next(err);
        res.json(results);
      });
    });
  },

  show: function(req, res, next) {
    User.findById(hashids.decodeHex(req.params.id), function(err, userModel) {
      if (err) return next(err);
      user = userModel.toObject();
      user._id = userModel.getHash();
      remove(user, 'email', 'password', '__v', 'resetPasswordToken', 'resetPasswordExpires', 'tokens');
      res.json(user);
    });
  },

  update: function(req, res, next) {
    var query = hashids.decodeHex(req.params.id);
    if (req.body.addSub) {
      var push = { $push: {'subscriptions': String(req.body.addSub)} };
      User.findByIdAndUpdate(query, push, function(err) {
        if (err) return next(err);
        res.json({ success: 'Succesfully added ' + req.body.addSub + ' to subscriptions.' });
      });
    }

    if (req.body.removeSub) {
      var pull = { $pull: {'subscriptions': String(req.body.removeSub)} };
      User.findByIdAndUpdate(query, pull, function(err) {
        if (err) return next(err);
        res.json({ success: 'Succesfully removed ' + req.body.removeSub + ' from subscriptions.' });
      });
    }
  }

};

/**
 * Delete one or more object's properties.
 *
 * @param {Object} obj
 */
function remove(obj) {
  var len = arguments.length;
  while(len--) {
    if (len === 0) break;
    delete obj[arguments[len]];
  }
}
