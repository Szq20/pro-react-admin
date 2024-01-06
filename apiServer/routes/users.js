/* eslint-disable @babel/new-cap */
let express = require('express');
let router = express.Router();
const userController = require('../controllers/user');

// /* GET users listing. */
// router.post('/user/detail', function (req, res, next) {
//     res.send({
//         name: 'shenzhiqiang',
//         age: 21,
//         sex: '男',
//         hobby: ['篮球', '足球']
//     });
// });

// 获取用户信息;
router.post('/user/detail', userController.showUser);

// 获取用户信息
router.get('/get_user', userController.showUser);

module.exports = router;
