const User = new (require('../models/user'))();

/**
 * 用户控制器
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.getUser = function(req, res, next) {

    User.finduser({},function(err,data){
        if(err) {
            next(err);
        }
        res.send(data);
    })
    
}