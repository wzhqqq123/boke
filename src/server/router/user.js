const express = require('express');
const router = express.Router();
const path = require('path');

// 导入multer包
const multer = require("multer");
const storage = multer.diskStorage({
  // 配置文件上传后存储的路径
  destination: function (req, file, cb) {
    // NodeJS的两个全局变量
    // console.log(__dirname);  //获取当前文件在服务器上的完整目录 
    // console.log(__filename); //获取当前文件在服务器上的完整路径 
    cb(null, path.join(__dirname, '../source'))
  },
  // 配置文件上传后存储的路径和文件名
  filename: function (req, file, cb) {
    cb(null, 'headIcon' + path.extname(file.originalname))
  }
})
const upload = multer({ storage: storage })


// 导入用户路由处理函数模块
const userHandler = require('../router_handler/user')
// 1. 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')

// 2. 导入需要的验证规则对象
const { update_password_schema } = require('../schema/user')
const { messageLeave_schema } = require('../schema/user')

messageLeave_schema
// 获取用户信息
router.get('/getUserInfo', userHandler.getUser)
// 更新用户信息
router.post('/updateUseInfo', userHandler.updateUse)
// 更新密码
router.post('/updatePassword', expressJoi(update_password_schema), userHandler.updatePassword)
// 更换头像
router.post('/updateAvatar', upload.single('headIcon'), userHandler.updateAvatar)
// 获取用户头像信息
router.get('/getAvatar', userHandler.getAvatar)
// 用户添加留言
router.post('/addMessageLeave', expressJoi(messageLeave_schema), userHandler.addMessageLeave)

module.exports = router

