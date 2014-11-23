var chai = require('chai');
var should = chai.should();
var User = require('../app/models/user');

describe('User Model', function() {
  it('should create a new user', function(done) {
    var user = new User({
      uid: 'test',
      username: 'Test',
      email: 'test@gmail.com',
      password: 'password'
    });
    user.save(function(err) {
      if (err) return done(err);
      done();
    });
  });

  it('should not create a user with the unique email', function(done) {
    var user = new User({
      uid: 'test1',
      username: 'Test1',
      email: 'test@gmail.com',
      password: 'password'
    });
    user.save(function(err) {
      if (err) err.code.should.equal(11000);
      done();
    });
  });

  it('should find user by email', function(done) {
    User.findOne({ email: 'test@gmail.com' }, function(err, user) {
      if (err) return done(err);
      user.email.should.equal('test@gmail.com');
      user.getHash().should.be.a('string');
      user.gravatar().should.be.a('string');
      user.gravatar(200).should.be.a('string');
      user.comparePassword('password', function(err, isMatch) {
        isMatch.should.equal(true);
      });
      user.comparePassword('test', function(err, isMatch) {
        isMatch.should.equal(false);
      });
      done();
    });
  });

  it('should delete a user', function(done) {
    User.remove({ email: 'test@gmail.com' }, function(err) {
      if (err) return done(err);
      done();
    });
  });
});
