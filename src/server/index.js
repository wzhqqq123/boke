// 1.导入express
const express = require("express");
const fs = require('fs');
const path = require('path');
// querystringify模块
const qs = require("querystringify");
// 导入cors模块解决跨域
const cors = require("cors");
const userRouter = require('./router/user'); // 导入路由对象
const loginRouter = require('./router/login'); // 导入路由对象
// 捕捉schema的验证失败错误
const joi = require('joi');
// 建立与mysql数据库的连接
const db = require("./db/index");
// 导入配置文件
const config = require('./config')
// 解析 token 的中间件
const expressJWT = require('express-jwt')

// 2.创建web服务器
const app = express();
app.use(cors()); // 注册cors解决跨域
// 配置解析 application/json 格式数据的内置中间件
app.use(express.json());
// 配置解析 application/x-www-form-urlencoded 格式数据的内置中间件
app.use(express.urlencoded({ extended: false }));


// 全局中间件，封装res.send处理
app.use(function (req, res, next) {
  // 默认将 code 的值设置为 500，方便处理失败的情况
  res.cc = function (err, code = 500, data) {
    let obj = {
      code, // 状态码
      message: err instanceof Error ? err.message : err, // 状态描述，判断 err 是 错误对象 还是 字符串
    };
    data ? obj.data = data : null;
    res.send(obj)
  }
  next()
})


// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//, /headIcon./] }))
app.use('/api', loginRouter); // 挂载路由对象
app.use(userRouter);
app.use(express.static('./src/server/source')); // 托管source文件


// 定义一个中间件,就是一个function处理函数加上next参数,处理逻辑最后加上next()流转给下一个中间件或路由
// 在中间件中，需要监听 req 对象的 data 事件，来获取客户端发送到服务器的数据。
// 如果数据量比较大，无法一次性发送完毕，则客户端会把数据切割后，分批发送到服务器。
// 所以 data 事件可能会触发多次，每一次触发 data 事件时，获取到数据只是完整数据的一部分，需要手动对接收到的数据进行拼接。
const getDataMw = (req, res, next) => {
  console.log('这是一个全局中间件');
  let str = "";
  // 监听 req 的 data 事件
  req.on("data", (chunk) => {
    str += chunk;
  });
  // 监听 req 的 end 事件
  req.on("end", () => {
    const body = qs.parse(str);
    req.body = body;
    next();
  });
}
// app.use(getDataMw); // 通过app.use调用就是全局中间件

// 定义错误中间件函数,用来捕获项目中的异常错误，防止项目崩溃
app.use(function (err, req, res, next) {
  // 捕获身份认证失败的错误
  if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！')
  // 数据验证失败
  if (err instanceof joi.ValidationError) return res.cc(err)
  // 未知错误
  res.cc(err)
})

// 3.调用app.listen(端口号，启动成功后的回调函数) 启动服务器
app.listen(8080, () => {
  console.log("express server running at http://127.0.0.1:8080");
});
