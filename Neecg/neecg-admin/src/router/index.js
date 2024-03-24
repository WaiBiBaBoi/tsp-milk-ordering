import { createRouter, createWebHistory } from 'vue-router'
import { getToken } from "@/utils/storage";
// import HomeView from '../views/HomeView.vue'



const routes = [
  {
    path: '/',
    name: 'system',
    redirect: 'system/menuList',
    component: () => import('@/views/index/index.vue'),
    children: [
      // {
      //   path: 'home',
      //   name: 'home',
      //   component: () => import('@/views/home/home.vue'),
      // },
      // {
      //   path: 'system/menu',
      //   name: 'menu',
      //   component: () => import('@/views/system/menuList.vue'),
      // }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/login.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
router.beforeEach((to, from, next) => {
  console.log(`Trying to go from ${from.fullPath} to ${to.fullPath}`);  // let token = getToken()
  // 假设 checkAuth() 是检查用户是否已经登录的方法
  if (!getToken() && to.path !== '/login') {
    // 如果用户未登录且目标路径不是 '/login'，则重定向到 '/login'
    next('/login');
  } else if (getToken() && to.path === '/login') {
    // 如果用户已登录且目标路径是 '/login'，则重定向到 '/system/userList'
    next('/');
  } else {
    // 在其他情况下，正常放行
    next();
  }
});

export default router
