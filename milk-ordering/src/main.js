import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
//---
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery';
import 'popper.js';
import 'bootstrap';

// 引入BootstrapVue
import { BootstrapVue3 } from 'bootstrap-vue-3'

// 引入Bootstrap和BootstrapVue css文件
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';
//---
import jQuery from 'jquery';
window.$ = window.jQuery = jQuery;
//---
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
//---

import router from './router' // 引入router配置
const app = createApp(App)
app.use(router); // 使用router
app.use(Antd)
app.use(BootstrapVue3);
app.mount('#app')
