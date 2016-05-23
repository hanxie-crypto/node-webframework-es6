/**
 * 用户控制器
 * @type {[type]}
 */
const userController = require('../controllers/usercontroller');

const user_root = {
    'get|/users|test': userController.getUser,
}
module.exports = user_root;
