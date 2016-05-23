/**
 * 用户查询
 * @type {[type]}
 */
var mysql = require('../db/mysqlDriver');
var user_sql = require('./user_sql');



class User {
    finduser(params, callback) {
        mysql.query(user_sql.finduser, params, function(err, _data) {
            if (err) {
                err.async = true; //是否异步发送
                callback(err, null);
            } else {
                var rep = {};
                rep.status = true;
                rep.data = _data
                callback(null, rep);
            }
        })
    }
}

module.exports = User;
