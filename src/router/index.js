import Vue from "vue";
import VueRouter from "vue-router";
import store from '@/store'
import { routes as userRouter } from "./modules/index";

// 解决Vue-Router升级导致的Uncaught(in promise) navigation guard问题
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalPush.call(this, location, onResolve, onReject);
  }
  return originalPush.call(this, location).catch((err) => err);
};

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "hash", //history
  routes: userRouter,
  // eslint-disable-next-line no-unused-vars
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 };
  },
});

router.beforeEach((to, from, next) => {
  let title = 'Gblog'
  if (to.meta.params){
      title = `${to.meta.title}:${to.params[to.meta.params] || ''} - ${title}`
  }else {
      title = `${to.meta.title} - ${title}`
  }
  document.title = title
  if (to.path !== from.path) {
      store.dispatch('setLoading', true);
  }
  next();
})
router.afterEach((to, from) => {
  // 最多延迟 关闭 loading
  setTimeout(() => {
      store.dispatch('setLoading', false);
  }, 1500)
})

export default router;
