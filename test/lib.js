var chai = require('chai');
var express = require('express');
var resource = require('../lib/resource');

var router = express.Router();
var should = chai.should();

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
