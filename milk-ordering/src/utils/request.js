// src/axiosInstance.js
import axios from 'axios';
import router from '../router/index';
// import {getToken} from '../utils/storage'
import { notification } from 'ant-design-vue';
import { getCookieValue } from "../utils/cookie";

axios.defaults.withCredentials = true
// 创建axios实例
const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:3000/api/', // 你的API基础URL
  // 更多配置...
});

// 添加请求拦截器
axiosInstance.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么，例如插入token
    const token = getCookieValue('milk-token'); // 假设你的token存储在localStorage
    if (token) {
      config.headers['milk-token'] = token;
    }
    // 显示加载动画
    // showLoadingAnimation();
    
    return config;
  },
  function (error) {
    // 处理请求错误
    // hideLoadingAnimation();
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axiosInstance.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    // hideLoadingAnimation();
    console.log(response);
    // token为空或者失效
    if(response.data.code == '403' || response.data.code == '401'){
      router.replace('/login')
    }
    // 数据插入验证异常
    if(response.data.code == '400'){
      notification['error']({
        message: response.data.message,
        description: response.data.data[0]
      });
    }
    return response.data;
  },
  function (error) {
    // 对响应错误做点什么
    // hideLoadingAnimation();

    if (error.response) {
      // 请求已发出，但服务器响应的状态码不在 2xx 范围内
      console.error('Error response', error.response);
      if(error.response.status == 401 || error.response.status == 403){
        console.log(error.response.status);
        router.replace('/login')

      }

    } else if (error.request) {
      // 请求已经发出，但没有收到响应
      console.error('Error request', error.request);
    } else {
      // 发送请求时出了点问题
      console.error('Error', error.message);
    }
    
    return Promise.reject(error);
  }
);

export  {
    axiosInstance
}