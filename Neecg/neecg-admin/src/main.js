import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import { createPinia } from 'pinia';
import {addRoute} from '@/utils/addRoute'
import registerGlobalComponents from '@/utils/registerGlobalComponents';
const pinia = createPinia();
const app = createApp(App)
addRoute().then(() => {
    registerGlobalComponents(app)
    app.use(router)
    app.use(Antd)
    app.use(pinia)
    app.mount('#app')
})
