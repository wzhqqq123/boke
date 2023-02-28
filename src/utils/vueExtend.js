import Vue from "vue";
import { Message } from "element-ui";
let extendPlugins = {
  /**
   * 全局控制消息弹窗
   * @param {string} message 消息内容
   * @param {number} duration 弹窗显示事件
   * @param {type} type  el-ui消息类型
   */
  _message(message, type = "error", duration = 1500) {
    Message({
      message,
      duration,
      type,
    });
  },
  /**
   * 全局控制打印日志
   * @param  {...any} args 
   */
  _debug(...args) {
    if (process.env.NODE_ENV == "development") {
      console.log(...args);
    }
  },
  /**
   * 
   * @returns 生成唯一标识uuid
   */
  _uuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
  },
};

let vueExtend = {
  install(Vue) {
    Object.assign(Vue.prototype, extendPlugins);
  },
};

Vue.use(vueExtend);
