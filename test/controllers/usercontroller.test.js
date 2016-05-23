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
  });
});