var mysql = require('../../db/mysqlDriver');
const should = require('should');

describe('test/db/mysqlDriver.test.js', function() {

    describe('query by mysql', function() {
        it('should get user data', function(done) {
            let sql = 'select * from user';
            mysql.query(sql, {}, function(err, data) {
                data.should.be.instanceof(Array)
                done(err);
            })
        });
    });
    describe('query by params', function() {
        it('should get data ', function(done) {
            let sql = 'select * from user where name=:name';
            mysql.query(sql, {name:'robin'}, function(err, data) {
                data.should.be.instanceof(Array);
                done();
            })
        });
    });
    describe('get no data because no this table', function() {
        it('should get no data and throw err', function(done) {
            let sql = 'select * from users';
            mysql.query(sql, {}, function(err, data) {
                err.code.should.equal('ER_NO_SUCH_TABLE');
                done();
            })
        });
    });
    
});
