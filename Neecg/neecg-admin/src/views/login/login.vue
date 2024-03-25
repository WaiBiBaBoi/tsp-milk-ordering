<template>
  <div class="login-box">
    <div class="title">
      <h1>Neecg 后台管理系统</h1>
    </div>
    <div class="from-box">
      <a-form
        :model="loginParam"
        name="basic"
        :label-col="{ span: 0 }"
        :wrapper-col="{ span: 24 }"
        autocomplete="off"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
        :rules="rules"
      >
        <a-form-item name="user_account">
          <a-input placeholder="账号" v-model:value="loginParam.user_account" />
        </a-form-item>
        <a-form-item name="user_password">
          <a-input-password
            placeholder="密码"
            v-model:value="loginParam.user_password"
          />
        </a-form-item>
        <a-form-item :wrapper-col="wrapperCol">
          <a-button type="primary" style="width: 100%" html-type="submit"
            >登录</a-button
          >
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { accountLogin } from "@/api/api";
import { setItem } from "@/utils/storage";
import {addRoute} from '@/utils/addRoute'
import router from "@/router/index";

const loginParam = reactive({});
const wrapperCol = reactive({ offset: 0, span: 24 });
const rules = reactive({
  user_account: [{ required: true, message: "请输入账号！" }],
  user_password: [{ required: true, message: "请输入密码！" }],
});
//提交成功
const onFinish = (values) => {
  accountLogin(loginParam)
    .then(async (result) => {
      setItem("token", result.data.token);
      setItem("user", result.data.user);
       addRoute().then(() => {
        router.push('/')
       })

    })
    .catch((err) => {});
};


// 提交失败
const onFinishFailed = (errorInfo) => {};
</script>

<style lang="less" scoped>
.login-box {
  padding-top: 150px;
  position: relative;
  min-height: 100vh;
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url("@/assets/loginBanner.png");

  .from-box {
    width: 600px;
    margin: auto;
  }
  .title {
    padding: 40px 0;
    h1 {
      font-weight: bold;
      text-align: center;
    }
    color: #fff;
  }
}

.login-box::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-size: cover;
  opacity: 0.5;
  /* 设置透明度为 0.5 */
  z-index: -1;
  /* 确保伪元素位于内容下方 */
}
</style>