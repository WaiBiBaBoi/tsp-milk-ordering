<template>
  <div class="head-container">
    <div class="container">
      <div class="logo" @click="goHome">Logo</div>
      <div class="user">
        <div v-if="user.id" class="userinfo">
        <a-popover placement="bottom">
          <template #content>
            <a>名称：{{ user.user_name }}</a>
          </template>
          <a-avatar :size="40" :src="user.avatar"> </a-avatar>
        </a-popover>
        <span class="op-item" @click="goUser">个人中心</span>
        <span class="op-item" @click="logout">退出登录</span>
      </div>
      <div class="login op-item" @click="goLogin" v-else>登录</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from "vue";
import { getCookieValue,deleteCookie } from "../utils/cookie";
import { jwtDecode } from "jwt-decode";
import router from "../router/index";

let user = reactive({})
const goHome = () => {
  router.push('/')

}
const goUser = () => {
  router.push('/user')
}
const logout = () => {
  deleteCookie("milk-token")
  for(let key in user){
    user[key] = undefined
  }
  router.push('/')
  window.location.replace()
}
const goLogin = () => {
  router.push('/login')
}
onMounted(() => {
  if (getCookieValue("milk-token")) {
    let decoded = jwtDecode(getCookieValue("milk-token"))
    Object.keys(decoded).forEach(key => {
      user[key] = decoded[key];
    });
  }
});
</script>

<style lang="less" scoped>
.head-container {
  height: 60px;
  // background: var(--theme-black);
  background: rgb(255, 255, 255);
  width: 100%;
  color: var(--theme-black);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
  box-sizing: border-box;
  // border-bottom: 1px solid var(--theme-black);
  box-shadow: 0 0px 15px 3px rgb(51, 51, 51);
}
.container {
  padding: 0;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .login {
    cursor: pointer;
  }
}
.logo{
  cursor: pointer;
}
.user{
  position: absolute;
  right: 10%;
  .op-item{
    font-size: 14px;
    margin-left: 12px;
    cursor: pointer;
    color: var(--theme-black);
  }
  .op-item:active{
    color: #1677ff;
  }
}

</style>