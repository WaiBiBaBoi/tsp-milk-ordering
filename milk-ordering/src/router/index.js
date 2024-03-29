import { createRouter, createWebHistory } from "vue-router";
import Index from "../view/index.vue"; // 引入Index组件
import Home from "../view/home.vue"; // 引入Home组件
import Product from "../view/product.vue"; // 引入Product组件
import ProductDetails from "../view/productDetails.vue"; // 引入ProductDetails组件
import Login from "../view/login.vue"; // 引入ProductDetails组件
import User from "../view/user.vue"; // 引入User组件
import { getCookieValue } from "../utils/cookie";

// 定义路由规则，每个路由规则映射到一个组件。
const routes = [
  {
    path: "/",
    component: Index,
    redirect: "home",
    children: [
      { path: "/home", component: Home },
      { path: "/product", component: Product },
      { path: "/product-detail", component: ProductDetails },
      { path: "/user", component: User },
    ],
  },
  { path: "/login", component: Login },
];

// 创建router实例，然后传 `routes` 配置
const router = createRouter({
  history: createWebHistory(), // 使用HTML5模式的路由
  routes, // 短语法，等同于 routes: routes
});
router.beforeEach((to, from, next) => {
  // 假设 checkAuth() 是检查用户是否已经登录的方法
  let token = getCookieValue("milk-token")
  if (!token && to.path === '/user') {
    // 如果用户未登录且目标路径是 '/user'，则重定向到 '/login'
    next('/login');
  } else if (token && to.path === '/login') {
    // 如果用户已登录且目标路径是 '/login'，则重定向到 '/'
    next('/');
  } else {
    // 在其他情况下，正常放行
    next();
  }
});
export default router;
