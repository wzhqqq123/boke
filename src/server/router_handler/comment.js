/**
 * 在这里定义和评论相关的路由处理函数，供 /router/comment.js 模块进行调用
 */
// 建立与mysql数据库的连接
const db = require("../db/index");
// 导入bcryptjs加密包
const fs = require('fs');
const path = require('path');

// 获取博客评论列表的处理函数
exports.getComment = (req, res) => {
  const body = req.body;
  const sql = "select * from commentlist where blogId=? order by createTime desc";
  const childSql = "select * from commentlist where parentId=? order by createTime";
  db.query(sql, [body.id], (err, results) => {
    if (err) return res.cc(err)
    if (results.length) {
      const commentData = results;
      let size = commentData.length; // 评论数量
      commentData.forEach((item, index) => {
        item.reply = [];
        // 查询每个评论是否有子评论
        db.query(childSql, [item.id], (err, results) => {
          if (err) return res.cc(err)
          if (results.length) {
            item.reply = results;
            size += results.length;
          }
          if (index === commentData.length - 1) {
            return res.cc("", 200, { data: commentData, size: size })
          }
        });
      })
    } else {
      return res.cc("暂无评论", 200);
    }
  });
}

// 增加博客评论的处理函数
exports.addComment = (req, res) => {
  const body = req.body;
  const sql = "insert into commentlist set ?";
  db.query(sql, body, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows === 1) {
      return res.cc('添加评论成功', 200)
    }
    res.cc("添加评论失败");
  });
}

// 回复博客评论的处理函数
exports.replyComment = (req, res) => {
  const body = req.body;
  const sql = "insert into commentlist set ?";
  db.query(sql, body, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows === 1) {
      return res.cc('回复评论成功', 200)
    }
    res.cc("回复评论失败");
  });
}
