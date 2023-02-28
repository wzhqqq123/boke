const routes = [
  // 重定向，即不存在的路由强制定位到/
  {
    path: "*",
    redirect: "/",
  },
  {
    path: "/",
    redirect: () => {
      return "/login";
    }, //动态重定向到项目的首页
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login.vue"),
    meta: { title: '登录' }
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/views/register.vue"),
    meta: { title: '注册' }
  },
  {
    path: "/index",
    name: "index",
    component: () => import("@/views/index.vue"),
    meta: { title: '首页' },
    children:[
      {
        path: '',
        component: () => import('@/views/Home.vue'),
        meta: { title: '首页' }
      },
      {
        path: '/home',
        component: () => import('@/views/Home.vue'),
        meta: { title: '首页' }
      },
      {
        path: '/category/:cate',
        name: 'category',
        component: () => import('@/views/Home.vue'),
        meta: { title: '分类', params: 'cate' }
      },
      {
        path: '/search/:words',
        name: 'search',
        component: () => import('@/views/Home.vue'),
        meta: { title: '搜索', params: 'words' }
      },
      {
        path: '/about',
        name: 'about',
        component: () => import('@/views/About.vue'),
        meta: { title: '关于' }
      },
      {
        path: '/article/:id',
        name: 'article',
        component: () => import('@/views/Articles.vue'),
        meta: { title: '文章' }
      },
      {
        path: '/selfCenter',
        name: 'selfCenter',
        component: () => import('@/views/selfCenter.vue'),
        meta: { title: '个人中心' }
      }
      
    ]
  },
]

export { routes };