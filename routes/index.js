/**
 * 路由配置
 * 规则请求方式|路由|中间件1|中间件2|
 */


const index = {
    'get|/|test': function(req, res, next) {
        res.render('index', {
            title: 'hehe'
        });
    }
}
module.exports = index;