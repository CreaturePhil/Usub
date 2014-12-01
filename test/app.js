var request = require('supertest');
var chai = require('chai');
var should = chai.should();
var app = require('../server.js');
var User = require('../app/models/user');

describe('GET /', function() {
  it('should return 200 OK', function(done) {
    request(app)
      .get('/')
      .expect(200, done);
  });
});

describe('GET /about', function() {
  it('should return 200 OK', function(done) {
    request(app)
      .get('/about')
      .expect(200, done);
  });
});

describe('GET /404', function() {
  it('should return 404 Page Not Found', function(done) {
    request(app)
      .get('/404')
      .expect(404, done);
  });
});

describe('GET /signup', function() {
  it('should return 200 OK', function(done) {
    request(app)
      .get('/signup')
      .expect(200, done);
  });
});

describe('GET /login', function() {
  it('should return 200 OK', function(done) {
    request(app)
      .get('/login')
      .expect(200, done);
  });
});

describe('GET /forgot_password', function() {
  it('should return 200 OK', function(done) {
    request(app)
      .get('/forgot_password')
      .expect(200, done);
  });
});

describe('GET /settings/account', function() {
  it('should return 302 Redirect', function(done) {
    request(app)
      .get('/settings/account')
      .expect(302, done);
  });
});

describe('GET /settings/password', function() {
  it('should return 302 Redirect', function(done) {
    request(app)
      .get('/settings/password')
      .expect(302, done);
  });
});

describe('GET /settings/delete', function() {
  it('should return 302 Redirect', function(done) {
    request(app)
      .get('/settings/delete')
      .expect(302, done);
  });
});

describe('GET /api/users', function() {
  it('should return 200 OK', function(done) {
    var user = new User({
      uid: 'test',
      username: 'Test',
      email: 'test@gmail.com',
      password: 'password'
    });
    user.save(function(err, newUser) {
      if (err) return done(err);
      request(app)
        .get('/api/users')
        .expect(200);
      request(app)
        .get('/api/users/' + newUser.getHash())
        .expect(200);
      User.remove({ email: 'test@gmail.com' }, function(err) {
        if (err) return done(err);
        done();
      });
    });
  });
});

describe('POST /signup', function() {
  it('should return 500 Internal Server Error', function(done) {
    request(app)
      .post('/signup')
      .field('username', 'test')
      .field('email', 'test@test.com')
      .field('password', 'testpass')
      .field('confirmPassword', 'testpass')
      .expect(500, done);
  });
});

describe('POST /login', function() {
  it('should return 500 Internal Server Error', function(done) {
    request(app)
      .post('/login')
      .field('username', 'test')
      .field('password', 'testpass')
      .expect(500, done);
  });
});

describe('NODE_ENV to production', function() {
  it('should be production env', function(done) {
    app.set('env', 'production');
    app.get('env').should.equal('production');
    app = require('../server.js');
    done();
  });
});
