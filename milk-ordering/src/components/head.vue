<template>
  <div class=" head-container">
    <div class="container">
      <div class="logo">
        Logo
      </div>
      <div class="login">
        登录
      </div>
    </div>
  </div>
</template>

<script setup>
import {getCookieValue} from '../utils/cookie'
console.log(getCookieValue('milk-token'));
</script>

<style lang="less" scoped>
.head-container{
  height: 60px;
  background: var(--theme-black);
  width: 100%;
  color: #FFF;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
}
.container{
  padding: 0;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .login{
    cursor: pointer;
  }
}
</style>