/**
 * 在这里定义和用户相关的路由处理函数，供 /router/user.js 模块进行调用
 */
// 建立与mysql数据库的连接
const db = require("../db/index");
// 导入bcryptjs加密包
const fs = require('fs');
const path = require('path');

// 获取博客列表的处理函数
exports.getBlogList = (req, res) => {
  const body = req.body;
  const min = body.size * (body.currPage - 1);
  const max = body.size * body.currPage;
  let sql = "select * from blogList where author=? order by isTop desc,id asc limit ?,?";
  let sizeSql = "select count(id) from blogList where author=?";
  let params = [req.user.username, min, max];
  let sizeParams = [req.user.username];
  if (body.category) {
    sql = "select * from blogList where author=? and category=? order by isTop desc,id asc limit ?,?";
    params = [req.user.username, body.category, min, max];
    sizeSql = "select count(id) from blogList where author=? and category=?";
    sizeParams = [req.user.username, body.category];
  } else if (body.searchWords) {
    sql = "select * from blogList where author=? and (title like? or summary like?) order by isTop desc,id asc limit ?,?";
    params = [req.user.username, `%${body.searchWords}%`, `%${body.searchWords}%`, min, max];
    sizeSql = "select count(id) from blogList where author=? and (title like? or summary like?)";
    sizeParams = [req.user.username, `%${body.searchWords}%`, `%${body.searchWords}%`];
  }
  db.query(sql, params, (err, results) => {
    if (err) return res.cc(err)
    if (results.length) {
      const blogData = results;
      db.query(sizeSql, sizeParams, (err, results) => {
        if (err) return res.cc(err)
        if (results.length) {
          const hasNextPage = results[0]["count(id)"] > max;
          return res.cc('', 200, {
            data: {
              list: blogData,
              currPage: body.currPage,
              hasNextPage: hasNextPage,
              total: results[0]["count(id)"]
            }
          })
        }
      })
    } else {
      return res.cc("博客列表为空", 200);
    }
  });
}

// 获取所有博客列表的处理函数
exports.getAllBlogList = (req, res) => {
  const body = req.body;
  const min = body.size * (body.currPage - 1);
  const max = body.size * body.currPage;
  let sql = "select * from blogList order by isTop desc,id asc limit ?,?";
  let sizeSql = "select count(id) from blogList";
  let params = [min, max];
  let sizeParams = [];
  if (body.searchWords) {
    sql = "select * from blogList where (title like? or summary like? or author like?) order by isTop desc,id asc limit ?,?";
    params = [`%${body.searchWords}%`, `%${body.searchWords}%`, `%${body.searchWords}%`, min, max];
    sizeSql = "select count(id) from blogList where (title like? or summary like? or author like?)";
    sizeParams = [`%${body.searchWords}%`, `%${body.searchWords}%`, `%${body.searchWords}%`];
  }
  db.query(sql, params, (err, results) => {
    if (err) return res.cc(err)
    if (results.length) {
      const blogData = results;
      db.query(sizeSql, sizeParams, (err, results) => {
        if (err) return res.cc(err)
        if (results.length) {
          const hasNextPage = results[0]["count(id)"] > max;
          return res.cc('', 200, {
            data: {
              list: blogData,
              currPage: body.currPage,
              hasNextPage: hasNextPage,
              total: results[0]["count(id)"]
            }
          })
        }
      })
    } else {
      return res.cc("博客列表为空", 200);
    }
  });
}

// 获取博客详情的处理函数
exports.getBlogDetail = (req, res) => {
  const body = req.body;
  db.query("select * from blogList where id=?", body.id, (err, results) => {
    if (err) return res.cc(err)
    if (results.length) {
      let detail = results[0];
      detail.htmlContent = detail.htmlContent.replaceAll("\\n", "");
      return res.cc('', 200, {
        data: detail
      })
    }
    res.cc("博客不存在或已被删除");
  });
}

// 增加博客浏览数量的处理函数
exports.addViewsCount = (req, res) => {
  const body = req.body;
  const viewsCount = body.viewsCount + 1;
  const isHot = viewsCount >= 50 ? 1 : 0;
  db.query("update blogList set viewsCount=?,isHot=? where id=?", [viewsCount, isHot, body.id], (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows === 1) {
      return res.cc('', 200)
    }
    res.cc("博客浏览量更新失败");
  });
}

// 获取博客分类的处理函数
exports.getCategory = (req, res) => {
  db.query("select category from blogList where author=?", req.user.username, (err, results) => {
    if (err) return res.cc(err)
    if (results.length) {
      let category = [];
      results.forEach(item => {
        if (category.findIndex(el => el.title === item.category.toUpperCase()) == -1) {
          category.push({
            href: `/category/${item.category}`,
            id: category.length + 1,
            title: item.category.toUpperCase()
          })
        }
      })
      return res.cc('', 200, {
        data: category
      })
    }
    res.cc("",200);
  });
}



// 创建新博客的处理函数
exports.createBlog = (req, res) => {
  const body = req.body;
  db.query("insert into blogList set ?", body, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows === 1) {
      // 获取分类列表给前端
      db.query("select category from blogList where author=?", req.user.username, (err, results) => {
        if (err) return res.cc(err)
        if (results.length) {
          let category = [];
          results.forEach(item => {
            if (category.findIndex(el => el.title === item.category.toUpperCase()) == -1) {
              category.push({
                href: `/category/${item.category}`,
                id: category.length + 1,
                title: item.category.toUpperCase()
              })
            }
          })
          return res.cc('博客保存成功', 200, { data: category })
        }
        res.cc("",200);
      });
    } else {
      res.cc("新增博客失败！");
    }
  });
}

// 编辑博客的处理函数
exports.editBlog = (req, res) => {
  const body = req.body;
  db.query("update blogList set ? where id=?", [body, body.id], (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows === 1) {
      // 获取分类列表给前端
      db.query("select category from blogList where author=?", req.user.username, (err, results) => {
        if (err) return res.cc(err)
        if (results.length) {
          let category = [];
          results.forEach(item => {
            if (category.findIndex(el => el.title === item.category.toUpperCase()) == -1) {
              category.push({
                href: `/category/${item.category}`,
                id: category.length + 1,
                title: item.category.toUpperCase()
              })
            }
          })
          return res.cc('博客修改保存成功', 200, { data: category })
        }
        res.cc("",200);
      });
    } else {
      res.cc("博客编辑失败！");
    }
  });
}


// 删除博客的处理函数
exports.deleteBlog = (req, res) => {
  const body = req.body;
  db.query("delete from blogList where id=?", body.id, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows === 1) {
      return res.cc('博客删除成功', 200, {
        status: 'ok'
      })
    }
    res.cc("删除博客失败！");
  });
}

// 博客上传文件处理函数
exports.uploadFile = (req, res) => {
  if (req.file) {
    const targetPath = path.join(__dirname, `../source/blog/${req.user.username}`);
    const isExist = fs.existsSync(targetPath); // 查看用户名的文件路径是否存在
    if (!isExist) {
      fs.mkdirSync(targetPath);
    }
    const fileName = req.file.filename;
    const sourceFile = path.join(__dirname, "../source/blog", fileName);
    const destPath = path.join(targetPath, fileName);
    fs.rename(sourceFile, destPath, function (err) {
      if (err) return res.cc(err)
      fs.stat(destPath, function (err, stats) {
        if (err) return res.cc(err.message)
        return res.cc('上传图片成功！', 200, {
          data: `/blog/${req.user.username}/${fileName}`
        });
      });
    });
  } else {
    res.cc('上传失败！', 500);
  }
}


// 博客上传封面处理函数
exports.uploadBanner = (req, res) => {
  if (req.file) {
    const targetPath = path.join(__dirname, `../source/blog/${req.user.username}`);
    const isExist = fs.existsSync(targetPath); // 查看用户名的文件路径是否存在
    if (!isExist) {
      fs.mkdirSync(targetPath);
    }
    const fileName = req.file.filename;
    const sourceFile = path.join(__dirname, "../source/blog", fileName);
    const destPath = path.join(targetPath, fileName);
    fs.rename(sourceFile, destPath, function (err) {
      if (err) return res.cc(err)
      fs.stat(destPath, function (err, stats) {
        if (err) return res.cc(err.message)
        // 保存头像文件路径到数据库
        const updateSql = "update blogList set banner=? where pubTime=? && author=?";
        const blogUrl = path.join("/blog", `/${req.user.username}`, fileName);
        db.query(updateSql, [blogUrl, req.body.pubTime, req.user.username], (err, results) => {
          if (err) return res.cc(err)
          if (results.affectedRows === 1) {
            return res.cc('', 200);
          }
        });
      });
    });
  } else {
    res.cc('上传封面失败！', 500);
  }
}

// 更新博客评论数量的处理函数
exports.updateCommentCount = (req, res) => {
  const body = req.body;
  db.query("update blogList set commentsCount=? where id=?", [++body.commentsCount, body.blogId], (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows === 1) {
      return res.cc('', 200)
    }
    res.cc("博客评论数量更新失败");
  });
}
