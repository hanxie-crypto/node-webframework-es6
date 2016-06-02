/**
 * 路由配置
 * 规则:请求方式|路由|中间件1|中间件2|
 */

const crypto = require('crypto');

/**
 * 加密
 * @return {[type]} [description]
 */
const getHash = function(str) {
    const sharsum = crypto.createHash('sha1');
    return sharsum.update(str).digest('base64');
}


const index = {
    'get|/|test': function(req, res, next) {
        res.render('index', {
            title: 'index'
        });
    },
    'get|/etag': function(req, res, next) {
        let preetag = req.headers['if-none-match'];
        console.log(preetag);
        if (typeof preetag !== 'undefined') {
            res.render('index', {
                title: 'etag'
            }, function(err, html) {
                if (err) {
                    next(err);
                } else {
                    let nowetag = getHash(html);
                    console.log(nowetag);
                    if (nowetag === preetag) {
                        res.status(304).end();
                    } else {
                        res.send(html);
                    }
                }
            });
        } else {
            res.render('index', {
                title: 'etag',
            }, function(err, html) {
                if (err) {
                    next(err);
                } else {
                    let etag = getHash(html);
                    res.setHeader("ETag", etag);
                    res.send(html);
                }
            })

        }
    },
    'get|/expires': function(req, res, next) {
        let expires = new Date();
        console.log(expires);
        expires.setTime(expires.getTime() + 10 * 365 * 24 * 60 * 60 * 1000);
        res.setHeader('Expires', expires.toUTCString());
        res.render('index', {
            title: 'expires'
        });
    },
    'get|/cachecontrol': function(req, res, next) {

        res.setHeader('Cache-Control', 'max-age=' + 10 * 365 * 24 * 60 * 60 * 1000);

        res.render('index', {
            title: 'cachecontrol'
        });
    },
}
module.exports = index;