const express = require('express');
const router = express.Router();
const path = require('path');

// 导入用户路由处理函数模块
const commentListHandler = require('../router_handler/comment')
// 1. 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')
// 2. 导入需要的验证规则对象
const { add_comment_schema } = require('../schema/comment')
const { reply_comment_schema } = require('../schema/comment')

// 获取博客评论列表
router.post('/getComment', commentListHandler.getComment)

// 增加博客评论
router.post('/addComment', expressJoi(add_comment_schema), commentListHandler.addComment)

// 回复博客评论
router.post('/replyComment', expressJoi(reply_comment_schema), commentListHandler.replyComment)

module.exports = router

