// 将开发所有的插件在此统一管理引入
import Vue from "vue";
// 导入loadsh使用节流
import _ from 'lodash'

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
Vue.filter('parseTime', (v) => parseTime(v, '{y}-{m}-{d} {h}:{m}:{s}'))

import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css'	//样式
Vue.directive('highlight', function (el) {
  let blocks = el.querySelectorAll('pre code');
  blocks.forEach((block) => {
    hljs.highlightBlock(block)
  })
})

import mavonEditor from 'mavon-editor' // components
import 'mavon-editor/dist/css/index.css' // styles

import "@/components/global/index" // 导入全局注册组件

// 为了防止XSS攻击,格式化<>等标签
import VueDOMPurifyHTML from 'vue-dompurify-html'
Vue.use(VueDOMPurifyHTML)

Vue.config.productionTip = false

Vue.use(ElementUI);
Vue.use(mavonEditor);
