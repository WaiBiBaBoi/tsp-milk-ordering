<template>
  <a-config-provider :locale="zhCN">
    <router-view />
  </a-config-provider>
</template>
<script setup>
import { ConfigProvider } from 'ant-design-vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
</script>
<style>

</style>
