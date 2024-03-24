<template>
  <div class="login-container">
    <div class="container">
      <div class="box-container">
        <div class="login-box">
          <a-form
            :model="param"
            layout="vertical"
            name="basic"
            ref="formRef"
            :rules="rules"
            autocomplete="off"
            @finish="onFinish"
            @finishFailed="onFinishFailed"
          >
            <a-form-item label="账号" name="username" class="color-fff">
              <a-input v-model:value="param.username" />
            </a-form-item>

            <a-form-item label="密码" name="password" class="color-fff">
              <a-input-password v-model:value="param.password" />
            </a-form-item>
            <a-form-item
              v-if="formState === 'register'"
              label="验证码"
              name="code"
              class="color-fff"
            >
              <a-input-group compact>
                <a-input
                  v-model:value="param.code"
                  style="width: calc(100% - 80px)"
                />
                <a-button type="primary" style="width: 80px">获取</a-button>
              </a-input-group>
            </a-form-item>
            <a-button type="primary" html-type="submit" style="width: 100%">{{
              formState === "login" ? "登录" : "注册"
            }}</a-button>
          </a-form>
          <p
            style="font-size: 14px; margin-top: 12px; cursor: pointer"
            @click="handleFormState"
          >
            <span v-if="formState === 'login'">暂无账号？点击注册！</span>
            <span v-if="formState === 'register'">已有账号？点击登录！</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
let formState = ref("login");
let param = reactive({
  username: "",
  password: "",
  code: "",
});
const formRef = ref(null);
let rules = reactive({
  username: [
    { required: true, message: "Please input your username!" },
    {
      type: "email",
      message: "Please input a valid email!",
      trigger: ["blur", "change"],
    },
    {
      pattern: /^[1-9][0-9]{4,}@qq\.com$/,
      message: "Please input a valid QQ email!",
      trigger: ["blur", "change"],
    },
  ],
  password: [
    { required: true, message: "Please input your password!" },
    {
      min: 8,
      max: 16,
      message: "Password must be 8-16 characters!",
      trigger: "blur",
    },
    {
      pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/,
      message: "Password must include letters and numbers!",
      trigger: "blur",
    },
  ],
  code: [{ required: true, message: "Please input your code!" }],
});
const handleFormState = () => {
  formRef.value.resetFields();
  if (formState.value === "login") {
    formState.value = "register";
  } else if (formState.value === "register") {
    formState.value = "login";
  }
};
const onFinish = (values) => {
  console.log("Success:", values);
};
const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
</script>

<style lang="less" scoped>
.container {
  padding: 0;
  position: relative;
  height: 100vh;
}
.login-container {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url("../assets/loginBanner.png");
}

.login-container::before {
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
.box-container {
  width: 400px;
  position: absolute;
  top: 200px;
  color: #fff;
  transition: 0.3s;

  .login-box {
    width: 100%;
  }
  .text-muted {
    color: red !important;
  }
}
.color-fff{
    .ant-form-item-required{
        color: #FFF !important;
    }
}
</style>