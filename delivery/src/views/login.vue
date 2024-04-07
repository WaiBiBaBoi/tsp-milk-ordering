<template>
  <a-config-provider :auto-insert-space-in-button="false">
    <div class="login-container">
      <a-card class="login-card">
        <a-form
          ref="formRef"
          @finish="onFinish"
          @finishFailed="onFinishFailed"
          layout="vertical"
          :rules="rules"
          :model="loginForm"
        >
          <a-form-item label="账号" name="delivery_account">
            <a-input
              v-model:value="loginForm.delivery_account"
              placeholder="账号"
            ></a-input>
          </a-form-item>
          <a-form-item label="密码" name="delivery_password">
            <a-input-password
              v-model:value="loginForm.delivery_password"
              placeholder="密码"
            ></a-input-password>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" html-type="submit" block> 登录 </a-button>
          </a-form-item>
        </a-form>
      </a-card>
    </div>
  </a-config-provider>
</template>

<script setup>
// ... JavaScript remains the same
import { reactive } from "vue";
import { setItem } from "@/utils/storage";
import router from "@/router/index";
import { httpAction, getAction } from "@/api/manage.js";
const rules = reactive({
  delivery_account: [{ required: true, message: "请输入账号！" }],
  delivery_password: [{ required: true, message: "请输入密码！" }],
});
let loginForm = reactive({
  delivery_account: "", // 初始化账号为空字符串
  delivery_password: "", // 初始化密码为空字符串
});

const onFinish = (values) => {
  console.log(123);
  httpAction("Delivery/login", loginForm, "post")
    .then(async (result) => {
      if (result.code === "0000") {
        setItem("delivery-token", result.data.token);
        setTimeout(() => {
          router.push("/list");
        }, 300);
      }
    })
    .catch((err) => {});
};

// 提交失败
const onFinishFailed = (errorInfo) => {};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Full height */
}

.login-card {
  max-width: 300px;
  width: 100%;
}

/* 响应式布局 */
@media screen and (max-width: 600px) {
  .login-card {
    margin: 20px;
  }
}
</style>