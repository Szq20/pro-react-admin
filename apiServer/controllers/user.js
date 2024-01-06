// 引用用户模版数据
const User = require('../models/user.js');

const userController = {
    // showUser 获取用户详情并返回到页面
    showUser: async function (req, res, next) {
        try {
            let userData = await User.all();
            res.json({
                code: 200,
                message: '操作成功',
                data: userData[0]
            });
        } catch (e) {
            res.json({code: 0, message: '操作失败', data: e});
        }
    }
};

module.exports = userController;