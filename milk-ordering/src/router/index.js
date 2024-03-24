import { createRouter, createWebHistory } from "vue-router";
import Index from "../view/index.vue"; // 引入Index组件
import Home from "../view/home.vue"; // 引入Home组件
import Product from "../view/product.vue"; // 引入Product组件
import ProductDetails from "../view/productDetails.vue"; // 引入ProductDetails组件
import Login from "../view/login.vue"; // 引入ProductDetails组件
import User from "../view/user.vue"; // 引入User组件

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

export default router;
