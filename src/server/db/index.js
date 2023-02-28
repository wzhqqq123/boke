// 导入 mysql 模块
const mysql = require('mysql')

// 创建数据库连接对象
const db = mysql.createPool({
  host: "127.0.0.1", // 数据库的ip地址
  user: "root", // 登录账号
  password: "root", // 登录密码
  database: "wzhSys", // 操作哪个数据库
});

// 向外共享 db 数据库连接对象
module.exports = db
