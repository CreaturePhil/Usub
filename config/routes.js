var express = require('express');
var passport = require('passport');
var path = require('path');

var resource = require('../lib/resource');

var controllers = '../app/controllers';
var mainController = require(path.join(controllers, 'main_controller'));
var userController = require(path.join(controllers, 'user_controller'));
var apiUsersController = require(path.join(controllers, 'api/users'));

var login_required = require('./passport').isAuthenticated;

var router = express.Router();

router.route('/')
  .get(mainController.index);

router.route('/about')
  .get(mainController.about);

router.route('/privacy')
  .get(mainController.privacy);

router.route('/terms')
  .get(mainController.terms);

router.route('/signup')
  .get(userController.signup.get)
  .post(userController.signup.post);

router.route('/login')
  .get(userController.login.get)
  .post(userController.login.post);

router.route('/logout')
  .get(userController.logout);

router.route('/forgot_password')
  .get(userController.forgotPassword.get)
  .post(userController.forgotPassword.post);

router.route('/reset_password/:token')
  .get(userController.resetPassword.get)
  .post(userController.resetPassword.post);

router.route('/settings/account')
  .get(login_required, userController.account.get)
  .post(login_required, userController.account.post);

router.route('/settings/sync')
  .get(login_required, userController.sync.get)
  .post(login_required, userController.sync.post);

router.route('/settings/videos')
  .get(login_required, userController.videos.get)
  .post(login_required, userController.videos.post);

router.route('/settings/account')
  .get(login_required, userController.account.get)
  .post(login_required, userController.account.post);

router.route('/settings/password')
  .get(login_required, userController.updatePassword.get)
  .post(login_required, userController.updatePassword.post);

router.route('/settings/delete')
  .get(login_required, userController.deleteAccount.get)
  .post(login_required, userController.deleteAccount.post);

router.route('/subscriptions')
  .get(login_required, userController.subscriptions);

resource('/api/users', apiUsersController, router);

router.route('/:user')
  .get(userController.profile);

router.route('/user/:name')
  .get(mainController.youtubeChannel);

router.route('/channel/:name')
  .get(mainController.youtubeChannel);

router.route('/:user')
  .get(userController.profile);

module.exports = router;
