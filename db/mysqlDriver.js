/**
 * mysql 连接工具
 * @type {[type]}
 */
var mysql = require('mysql');
var config = require('../config');
var _ = require('lodash');
var pool = mysql.createPool(_.extend(
    config.mysql, {
        typeCast: function(field, next) {
            if (field.type == 'FLOAT') {
                return (field.string());
            }
            return next();
        },
        queryFormat: function(query, values) {
            if (!values) return query;
            return query.replace(/\:(\w+)/g, function(txt, key) {
                if (values.hasOwnProperty(key)) {
                    if (key == 'ordercondation' || key == 'order') {
                        return escape(values[key]);
                    } else {
                        return this.escape(values[key]);
                    }
                }
                return txt;
            }.bind(this));
        }
    }));
/**
 * mysql 执行函数
 * @param  {[type]}   sql      [语句]
 * @param  {[type]}   params   [参数]
 * @param  {Function} callback [回调]
 * @return {[type]}            [无返回]
 */
exports.query = function(sql, params, callback) {
    pool.getConnection(function(err, connection) {
        if (err) {
            connection.release();
            callback(err, null);
        } else {
            connection.query(sql, params,
                function(err, rows) {
                    if (err) {
                        connection.release();
                        callback(err, null);
                    } else {
                        connection.release();
                        callback(null, rows);
                    }
                });
        }
    });
}