const app = require('../app');
const request = require('supertest');
const should = require('should');



describe('test/app.test.js', function () {
  it('should / status 200', function (done) {
    request(app).get('/').end(function (err, res) {
      res.status.should.equal(200);
      done();
    });
  });

});