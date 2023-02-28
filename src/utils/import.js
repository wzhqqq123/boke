// 将开发所有的插件在此统一管理引入
import Vue from "vue";

// element
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

// 功能扩展
import "./vueExtend";
// axios请求
import "./axios";
require('@/Mock')

import '@/assets/css/style.less' // 导入公共样式
import '@/assets/font/iconfont.css'
import { parseTime } from '@/utils/tools'
Vue.filter('parseTime', (v) => parseTime(v, '{y}-{m}-{d}'))

import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css'	//样式
Vue.directive('highlight', function (el) {
  let blocks = el.querySelectorAll('pre code');
  blocks.forEach((block) => {
    hljs.highlightBlock(block)
  })
})

import "@/components/global/index" // 导入全局注册组件

Vue.config.productionTip = false

Vue.use(ElementUI);
