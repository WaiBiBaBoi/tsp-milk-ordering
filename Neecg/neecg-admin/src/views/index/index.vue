<template>
  <a-layout>
    <a-layout-sider
      class="a-layout-sider"
      breakpoint="lg"
      collapsed-width="0"
      @collapse="onCollapse"
      @breakpoint="onBreakpoint"
    >
      <div class="logo" />
      <a-menu
        v-model:openKeys="state.openKeys"
        v-model:selectedKeys="state.selectedKeys"
        mode="inline"
        theme="dark"
        :inline-collapsed="state.collapsed"
        :items="menu"
        @select="selectMenu"
      ></a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header :style="{ background: '#fff', padding: 0 }">
        <div class="header">
          <div>
            <a-breadcrumb>
              <a-breadcrumb-item>Home</a-breadcrumb-item>
              <a-breadcrumb-item
                ><a href="">Application Center</a></a-breadcrumb-item
              >
              <a-breadcrumb-item
                ><a href="">Application List</a></a-breadcrumb-item
              >
              <a-breadcrumb-item>An Application</a-breadcrumb-item>
            </a-breadcrumb>
          </div>
          <div>
            <user-outlined />
            <a-divider type="vertical" />
            <span>Admin</span>
            <a-divider type="vertical" />
            <span @click="logOut" class="log-out">退出登录</span>
          </div>
        </div>
      </a-layout-header>
      <a-layout-content :style="{ margin: '24px 16px 0' }">
        <div
          :style="{ padding: '24px', background: '#fff', minHeight: '100%' }"
        >
          <router-view />
        </div>
      </a-layout-content>
      <a-layout-footer style="text-align: center">
        Ant Design ©2018 Created by Ant UED
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>
<script setup>
import { ref, reactive, watch, h, onMounted } from "vue";
import { useRoute } from 'vue-router';
import router from '@/router/index'
import { getMenu,clearUser,clearMenu } from "@/utils/storage";
import { buildTree } from "@/utils/buildTree";
const route = useRoute();
const state = reactive({
  collapsed: false,
  selectedKeys: [],
  openKeys: [],
  preOpenKeys: [],
});
let menu = reactive([]);

watch(
  () => state.openKeys,
  (_val, oldVal) => {
    state.preOpenKeys = oldVal;
  }
);

const onCollapse = (collapsed, type) => {
  console.log(collapsed, type);
};
const onBreakpoint = (broken) => {
  console.log(broken);
};
const selectMenu = (e) => {
    console.log(e);
    router.push('/' + e.item.route_address)
}

const logOut = () => {
  router.push('/login')
  clearUser()
  clearMenu()
}
onMounted(() => {
  let arr = getMenu();
  for (let i = 0; i < arr.length; i++) {
    arr[i].label = arr[i].menu_name;
    arr[i].title = arr[i].menu_name;
    arr[i].key = arr[i].id;
    let path = "/" + arr[i].route_address
    if(route.path == path){
        state.selectedKeys.push(arr[i].key)
        state.openKeys.push(arr[i].parent_id)
    }
  }
  const deleteChildren = (arr) => {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].children.length == 0) {
        delete arr[i].children;
      } else {
        deleteChildren(arr[i].children);
      }
    }
  };
  arr = buildTree(arr);
  deleteChildren(arr)
  menu.push(...arr);

});
</script>
<style scoped>
.logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}

.a-layout-sider {
  min-height: 100vh;
}

.header {
  padding: 0 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.log-out:hover{
  color: red;
  cursor: pointer;
}
</style>