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
    cb(null, path.join(__dirname, '../source/blog'))
  },
  // 配置文件上传后存储的路径和文件名
  filename: function (req, file, cb) {
    cb(null, new Date().getTime() + path.basename(file.originalname))
  }
})
const upload = multer({ storage: storage })


// 导入用户路由处理函数模块
const blogListHandler = require('../router_handler/blog')
// 1. 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')
// 2. 导入需要的验证规则对象
const { new_blog_schema } = require('../schema/blog')
const { edit_blog_schema } = require('../schema/blog')
const { delete_blog_schema } = require('../schema/blog')

// 获取博客列表
router.post('/getBlogList', blogListHandler.getBlogList)

// 获取博客详情
router.post('/getBlogDetail', blogListHandler.getBlogDetail)

// 增加博客浏览量
router.post('/addViewsCount', blogListHandler.addViewsCount)

// 获取博客列分类
router.get('/getCategory', blogListHandler.getCategory)

// 创建新博客
router.post('/createBlog', expressJoi(new_blog_schema), blogListHandler.createBlog)

// 编辑博客
router.post('/editBlog', expressJoi(edit_blog_schema), blogListHandler.editBlog)

// 删除博客
router.post('/deleteBlog', expressJoi(delete_blog_schema), blogListHandler.deleteBlog)

// 博客上传文件
router.post('/uploadFile', upload.single('file'), blogListHandler.uploadFile)

// 博客上传封面
router.post('/uploadBanner', upload.single('file'), blogListHandler.uploadBanner)

// 获取所有博客列表
router.post('/getAllBlogList', blogListHandler.getAllBlogList)

// 更新博客评论条数
router.post('/updateCommentCount', blogListHandler.updateCommentCount)

module.exports = router

