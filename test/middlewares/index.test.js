const request = require('supertest');
const app = require('../../app');
const should = require('should');
const jwt = require('jsonwebtoken');
const config = require('../../config');

describe('test/controllers/usercontroller.test.js', function() {

  describe('users', function() {
    it('should get data', function(done) {
      let token = jwt.sign('test', config.privatekey);
      request(app).get('/users')
        .set('x-access-token', token)
        .expect(200)
        .end(function(err, res) {
          res.status.should.equal(200);
          res.body.status.should.equal(true);
          res.body.should.have.property("data");
          done(err);
        });
    });
    it('should get tokenerr', function(done) {
      let token = jwt.sign('test', 'sssss0');
      request(app).get('/users')
        .set('x-access-token', token)
        .end(function(err, res) {
          res.body.success.should.equal(false);
          done(err);
        });
    });
    it('should forbidden 403', function(done) {
      request(app).get('/users')
        .end(function(err, res) {
          res.status.should.equal(403);
          done(err);
        });
    });
    it('should token expires', function(done) {
      let token = jwt.sign({
        test: 'test'
      }, config.privatekey, {
        algorithm: 'HS256',
        expiresIn: 1
      });
      setTimeout(function() {
        request(app).get('/users')
          .set('x-access-token', token)
          .expect(200)
          .end(function(err, res) {
            console.log(res.body);
            res.body.success.should.equal(false);
            done(err);
          });
      }, 2000);
    });
  });
});