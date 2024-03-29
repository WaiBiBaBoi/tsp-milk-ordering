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
            <a-form-item label="账号" name="user_account" class="color-fff">
              <a-input v-model:value="param.user_account" />
            </a-form-item>

            <a-form-item label="密码" name="user_password" class="color-fff">
              <a-input-password v-model:value="param.user_password" />
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
                <a-button type="primary" :disabled="codeState" style="width: 80px" @click="getCode"
                  >获取</a-button
                >
               
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
import { postAction } from "../api/manage";
import router from "../router/index";
import { message } from 'ant-design-vue';
let formState = ref("login");
let param = reactive({
  user_account: "",
  user_password: "",
  code: "",
});
let codeState = ref(false)
const formRef = ref(null);
let rules = reactive({
  user_account: [
    { required: true, message: "账号不能为空" },
    {
      type: "email",
      message: "请填写邮箱账号",
      trigger: ["blur", "change"],
    },
    {
      pattern: /^[1-9][0-9]{4,}@qq\.com$/,
      message: "邮箱格式需为QQ邮箱",
      trigger: ["blur", "change"],
    },
  ],
  user_password: [
    { required: true, message: "密码不能为空" },
    {
      min: 8,
      max: 16,
      message: "必须为8-16个字符!",
      trigger: "blur",
    },
    {
      pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/,
      message: "必须包含字母和数字!",
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
  let url = "";
  if (formState.value === "login") {
    url = "User/login";
  } else if (formState.value === "register") {
    url = "User/register";
  }
  login(url, values);
};
const login = (url, values) => {
  postAction(url, values).then((res) => {
    if (res.code === "0000") {
      if (formState.value === "login") {
        formRef.value.resetFields();
        codeState.value = false
        router.push("/");
      } else if (formState.value === "register") {
        formState.value = "login"
        login('User/login', values);
      }
    }else{
      message.error(res.message);
    }
  });
};
const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

const getCode = () => {
  console.log(2333);
  codeState.value = true
  postAction("Tools/email", { email: param.user_account }).then((res) => {
    console.log(res);
    if(res.code === '0000'){
      setTimeout(() => {
        codeState.value = false
      },6000 * 100)
    }else{
      codeState.value = false
    }
  });
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

</style>