<template>
  <div>
    <div class="app">
    <Haed></Haed>
    <div class="main">
      <router-view />
    </div>
    <Foot></Foot>
  </div>
  </div>
</template>

<script setup>
import Haed from "../components/head.vue";
import Foot from "../components/foot.vue";
</script>

<style lang="less" scoped>
.app{
  padding-top: 60px;
}
.main{
  min-height: calc(100vh - 120px);
}
</style>