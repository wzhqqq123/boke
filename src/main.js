import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// 全局导入
import "@/utils/import"

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
