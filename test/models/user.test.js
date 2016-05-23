const User = new(require('../../models/user'))();
const should = require('should');

describe('test/models/user.test.js', function() {

    describe('usersmodeltest', function() {
        it('should get user data', function(done) {
            User.finduser({}, function(err, data) {
               data.status.should.equal(true);
               data.should.have.property("data");
               done(err);
            })
        });
    });
});