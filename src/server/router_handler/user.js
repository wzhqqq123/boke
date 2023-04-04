/**
 * 在这里定义和用户相关的路由处理函数，供 /router/user.js 模块进行调用
 */
// 建立与mysql数据库的连接
const db = require("../db/index");
// 导入bcryptjs加密包
const bcryptjs = require("bcryptjs");
const fs = require('fs');
const path = require('path');

// 查询用户的处理函数
exports.getUser = (req, res) => {
  const username = req.query.username || req.user.username;
  db.query(`select * from userinfo where username='${username}'`, (err, results) => {
    if (err) return res.cc(err)
    if (results.length) { // 查到有对应的用户名和密码数据
      let { id, ...user } = results[0];
      user.password = "*********";
      user.headIcon = user.headIcon ? user.headIcon.replaceAll('\\', '/') : '';
      res.cc('获取用户信息成功！', 200, {
        data: user
      });
    } else {
      res.cc('获取用户信息失败！');
    }
  })
}

// 更新用户信息的处理函数
exports.updateUse = (req, res) => {
  const body = req.body;
  const updateSql = "update userinfo set ? where username=?";
  db.query(updateSql, [body, body.username], (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows === 1) {
      // 将更新后的数据信息传给前端
      db.query(`select * from userinfo where username='${body.username}'`, (err, results) => {
        if (err) return res.cc(err)
        if (results.length) { // 查更新后的用户信息
          const { id, ...user } = results[0];
          user.password = "*********";
          user.headIcon = user.headIcon?user.headIcon.replaceAll('\\', '/'):'';
          res.cc('更新用户信息成功！', 200, {
            data: user
          });
        }
      })

    }
  });
}

// 更新密码的处理函数
exports.updatePassword = (req, res) => {
  const body = req.body;
  db.query(`select * from userinfo where username='${req.user.username}'`, (err, results) => {
    if (err) return res.cc(err)
    if (results.length) { // 查到有对应的用户名和密码数据
      const pwOk = bcryptjs.compareSync(body.oldPwd, results[0].password); // 通过bcryptjs.compareSync解密判断密码是否相同
      if (pwOk) {
        const updateSql = "update userinfo set password=? where username=?";
        db.query(updateSql, [bcryptjs.hashSync(body.newPwd, 10), req.user.username], (err, results) => {
          if (err) return res.cc(err)
          if (results.affectedRows === 1) {
            return res.cc('更新密码成功,请重新登陆！', 200, { status: 1 });
          }
        });
      } else {
        return res.cc('旧密码错误！');
      }
    } else {
      res.cc('用户名不存在！');
    }
  })
}

// 更换头像处理函数
exports.updateAvatar = (req, res) => {
  if (req.file) {
    const targetPath = path.join(__dirname, `../source/headIcon/${req.user.username}`);
    const isExist = fs.existsSync(targetPath); // 查看用户名的文件路径是否存在
    if (!isExist) {
      fs.mkdirSync(targetPath);
    } else {
      let files = fs.readdirSync(targetPath);
      files.forEach(file => {
        if (/^headIcon*/.test(file)) {
          fs.unlinkSync(targetPath + '/' + file)
        }
      })
    }
    const fileName = req.file.filename;
    const sourceFile = path.join(__dirname, "../source/headIcon", fileName);
    const destPath = path.join(targetPath, fileName);
    fs.rename(sourceFile, destPath, function (err) {
      if (err) return res.cc(err)
      fs.stat(destPath, function (err, stats) {
        if (err) return res.cc(err.message)
        // 保存头像文件路径到数据库
        const updateSql = "update userinfo set headIcon=? where username=?";
        const headUrl = path.join("/headIcon", `/${req.user.username}`, fileName);
        db.query(updateSql, [headUrl, req.user.username], (err, results) => {
          if (err) return res.cc(err)
          if (results.affectedRows === 1) {
            return res.cc('头像更新同步成功！', 200, {
              data: headUrl.replaceAll('\\', '/')
            });
          }
        });
      });
    });
  }
}

// 获取用户头像的处理函数
exports.getAvatar = (req, res) => {
  db.query(`select headIcon from userinfo where username='${req.user.username}'`, (err, results) => {
    if (err) return res.cc(err)
    if (results.length) { // 当前用户存储有头像文件
      return res.cc('', 200, {
        data: results[0].headIcon ? results[0].headIcon.replaceAll('\\', '/') : ''
      })
    } else {
      res.cc('当前用户未设置头像！');
    }
  })
}

// 用户添加留言的处理函数
exports.addMessageLeave = (req, res) => {
  const messageInfo = req.body;
  messageInfo.username = req.user.username;
  const insertSql = "insert into messageLeaveList set ?";
  db.query(insertSql, messageInfo, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows === 1) {
      res.cc("留言成功，我会尽快回复您！", 200)
    }
  });
}

