import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/login.vue'
import { getToken } from "@/utils/storage";

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/list',
    name: 'list',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/list.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
router.beforeEach((to, from, next) => {
  console.log(`Trying to go from ${from.fullPath} to ${to.fullPath}`);  // let token = getToken()
  // 假设 checkAuth() 是检查用户是否已经登录的方法
  if (!getToken() && to.path !== '/') {
    // 如果用户未登录且目标路径不是 '/login'，则重定向到 '/login'
    next('/');
  } else if (getToken() && to.path === '/') {
    // 如果用户已登录且目标路径是 '/login'，则重定向到 '/system/userList'
    next('/list');
  } else {
    // 在其他情况下，正常放行
    next();
  }
});
export default router
