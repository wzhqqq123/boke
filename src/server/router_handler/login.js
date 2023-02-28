/**
 * 在这里定义和用户相关的路由处理函数，供 /router/user.js 模块进行调用
 */
// 建立与mysql数据库的连接
const db = require("../db/index");
// 导入bcryptjs加密包
const bcryptjs = require("bcryptjs");
// 用这个包来生成 Token 字符串
const jwt = require('jsonwebtoken');
// 导入配置文件
const config = require('../config')
// 导入base64解密包
const { Base64 } = require('js-base64');

// 注册用户的处理函数
exports.register = (req, res) => {
  const body = req.body;
  // 判断用户名是否已经存在
  db.query(`select * from userinfo where username='${body.username}'`, (err, results) => {
    if (err) return res.cc(err)
    if (results.length) { // 查到有相同用户名数据
      return res.cc('用户名被占用，请更换其他用户名！')
    }
    // 判断注册输入的两次密码是否相同
    if (body.password !== body.dbpassword) {
      return res.cc('两次输入密码不一致！')
    }

    // 插入新数据
    const newUser = {
      username: body.username,
      password: bcryptjs.hashSync(body.password, 10), // 通过bcryptjs.hashSync对原始密码加密存入数据库
      realname: body.realname,
    };
    body.email ? newUser.email = body.email : null;
    body.phone ? newUser.phone = body.phone : null;
    const sqlStr = "insert into userinfo set ?";
    db.query(sqlStr, newUser, (err, results) => {
      if (err) return res.cc(err)
      if (results.affectedRows === 1) {
        return res.cc("注册成功,请登录！", 200)
      }
      res.cc("注册失败,请稍后重试！")
    });
  });
}

// 登录的处理函数
exports.login = (req, res) => {
  const body = req.body;
  if (!body.username || !body.password) {
    return res.cc('用户名或密码不可为空！');
  }
  const password = Base64.decode(body.password); // 解密前端发来的密码
  db.query(`select * from userinfo where username='${body.username}'`, (err, results) => {
    if (err) return res.cc(err)
    if (results.length) { // 查到有对应的用户名和密码数据
      const pwOk = bcryptjs.compareSync(password, results[0].password); // 通过bcryptjs.compareSync解密判断密码是否相同
      if (pwOk) {
        // 生成token所需数据需要剔除用户的密码属性
        const { id, ...user } = results[0];
        user.password = "*********";
        user.headIcon = user.headIcon.replaceAll('\\', '/');
        // 生成 Token 字符串
        const tokenStr = jwt.sign(user, config.jwtSecretKey, {
          expiresIn: '10h', // token 有效期为 10 个小时
        })
        // 为了方便客户端使用 Token，在服务器端直接拼接上 Bearer 的前缀
        return res.cc(`登陆成功,欢迎您${results[0].realname}！`, 200, {
          data: {
            token: 'Bearer ' + tokenStr,
            userInfo: user
          }
        });
      }
      res.cc('密码错误！');
    } else {
      res.cc('用户名不存在！');
    }
  })
}
