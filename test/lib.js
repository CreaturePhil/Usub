var express = require('express');
var chai = require('chai');

var debug = require('../lib/debug');
var resource = require('../lib/resource');

var should = chai.should();
var router = express.Router();

describe('debugging a function', function() {
  it('should console.log a function as toString', function(done) {
    function sum(a, b) {
      return a + b;
    }
    debug(sum);
    done();
  });

  it('should console.log a object as json', function(done) {
    var obj = {
      a: 1,
      b: 2
    };
    debug(obj);
    done();
  });
});

describe('resource routing', function() {
  it('should map resources', function(done) {
    var testController = {
      index: function(req, res) {
        res.send('test');
      },
      new: function(req, res) {
        res.send('test');
      },
      create: function(req, res) {
        res.send('test');
      },
      show: function(req, res) {
        res.send('test');
      },
      edit: function(req, res) {
        res.send('test');
      },
      update: function(req, res) {
        res.send('test');
      },
      delete: function(req, res) {
        res.send('test');
      }
    };
    resource('/test', testController, router);    
    done();
  });
});
