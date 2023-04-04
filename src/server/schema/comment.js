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
const fromUserAvatar = joi.string().required();
const fromUserId = joi.string().required();
const fromUserName = joi.string().required();
const parentId = joi.number().required();
const blogId = joi.number().required();
const toUserId = joi.string().required();
const toUserName = joi.string().required();
const createTime = joi.number().required();

// 添加评论的验证规则对象
exports.add_comment_schema = {
  // 表示需要对 req.body 中的数据进行验证
  body: {
    content,
    fromUserAvatar,
    fromUserId,
    fromUserName,
    blogId,
    toUserId,
    toUserName,
    createTime
  },
}

// 回复评论的验证规则对象
exports.reply_comment_schema = {
  // 表示需要对 req.body 中的数据进行验证
  body: {
    content,
    fromUserAvatar,
    fromUserId,
    fromUserName,
    parentId,
    toUserId,
    toUserName,
    createTime
  },
}

