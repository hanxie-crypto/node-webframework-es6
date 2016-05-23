
exports.author = function(req,res,next) {
    if(!req.session.user){
        return res.status(403).json({info:'faile'});
    }
    next();
}

exports.test = function(req,res,next) {

    next();
}