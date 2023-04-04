const joi = require('joi')

/**
 * string() 值必须是字符串
 * alphanum() 值只能是包含 a-zA-Z0-9 的字符串
 * min(length) 最小长度
 * max(length) 最大长度
 * required() 值是必填项，不能为 undefined
 * pattern(正则表达式) 值必须符合正则表达式的规则
 */

// 用户名的验证规则
const content = joi.string().required();
const htmlContent = joi.string().required();
const summary = joi.string().required();
const author = joi.string().required();
const category = joi.string().required();
const title = joi.string().required();
const pubTime = joi.number().required();
const id = joi.required();
const isTop = joi.number().min(0).max(1).required();

// 创建新博客的验证规则对象
exports.new_blog_schema = {
  // 表示需要对 req.body 中的数据进行验证
  body: {
    content,
    htmlContent,
    summary,
    author,
    category,
    title,
    pubTime,
    isTop,
  },
}

// 创建编辑博客的验证规则对象
exports.edit_blog_schema = {
  // 表示需要对 req.body 中的数据进行验证
  body: {
    content,
    htmlContent,
    summary,
    category,
    title,
    pubTime,
    isTop,
    id
  },
}

exports.delete_blog_schema = {
  // 表示需要对 req.body 中的数据进行验证
  body: {
    id
  },
}
