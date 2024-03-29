<template>
  <a-layout>
    <a-layout-sider
      class="a-layout-sider"
      breakpoint="lg"
      collapsed-width="0"
      @collapse="onCollapse"
      @breakpoint="onBreakpoint"
    >
      <div class="logo" ></div>
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
              <a-breadcrumb-item
                v-for="(item, index) in breadcrumbs"
                :key="index"
                >{{ item.menu_name }}</a-breadcrumb-item
              >
            </a-breadcrumb>
          </div>
          <div>
            <user-outlined />
            <a-divider type="vertical" />
            <span>欢迎 ` {{userinfo.user_name}}；身份：{{ userinfo.user_role }}</span>
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
import { useRoute } from "vue-router";
import router from "@/router/index";
import { getMenu, clearUser, clearMenu,getUser } from "@/utils/storage";
import { buildTree } from "@/utils/buildTree";
const route = useRoute();
const state = reactive({
  collapsed: false,
  selectedKeys: [],
  openKeys: [],
  preOpenKeys: [],
});
let menu = reactive([]);
let breadcrumbs = reactive([]);
let userinfo = reactive(getUser())
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
const getMemuName = (arr, keyPath) => {
  for (let i = 0; i < keyPath.length; i++) {
    for (let n = 0; n < arr.length; n++) {
      console.log(keyPath[i], arr[n].id);
      if (keyPath[i] === arr[n].id) {
        breadcrumbs.push({
          menu_name: arr[n].menu_name,
        });
        if (arr[n].menu_type == 1) {
          getMemuName(arr[n].children, keyPath);
        }
        break;
      }
    }
  }
};
const currentMenu = (arr, currentPath) => {
  let result;
  for (let n = 0; n < arr.length; n++) {
    let path = "/" + arr[n].route_address;
    console.log(path === currentPath);
    if (path === currentPath) {
      return arr[n];
    } else {
      if (arr[n].menu_type == 1 && !result) {
        result = currentMenu(arr[n].children, currentPath);
      }
    }
  }
  return result;
};
const getParentMenu = (arr,parent_id) => {
  let result = []
  for(let i = 0; i < arr.length; i++){
    console.log(arr[i].id , parent_id);
    if(arr[i].id === parent_id){
      result.push(arr[i].id)
      return result
    }else{
      console.log(arr[i]);
      if(arr[i].parent_id){
        result = getParentMenu(arr,arr[i].parent_id)
      }
    }
  }
  return result
}
const selectMenu = (e) => {
  console.log(e);
  breadcrumbs.splice(0);
  getMemuName(menu, e.keyPath);
  console.log(breadcrumbs);
  router.push("/" + e.item.route_address);
};

const logOut = () => {
  router.push("/login");
  clearUser();
  clearMenu();
};
onMounted(() => {
  let arr = getMenu();
  for (let i = 0; i < arr.length; i++) {
    arr[i].label = arr[i].menu_name;
    arr[i].title = arr[i].menu_name;
    arr[i].key = arr[i].id;
    let path = "/" + arr[i].route_address;
    if (route.path == path) {
      state.selectedKeys.push(arr[i].key);
      state.openKeys.push(arr[i].parent_id);
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
  deleteChildren(arr);
  menu.push(...arr);
  breadcrumbs.splice(0);
  let keyPath = [...getParentMenu(menu,currentMenu(menu, route.path).parent_id),currentMenu(menu, route.path).id]
  getMemuName(menu,keyPath);

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
.log-out:hover {
  color: red;
  cursor: pointer;
}
</style>