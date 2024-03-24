<template>
  <a-drawer
    width="600px"
    v-model:open="open"
    class="custom-class"
    root-class-name="root-class-name"
    title="Basic Drawer"
    placement="right"
    @after-open-change="afterOpenChange"
  >
    <a-tree
      :field-names="fieldNames"
      v-model:expandedKeys="expandedKeys"
      v-model:selectedKeys="selectedKeys"
      v-model:checkedKeys="checkedKeys"
      checkable
      :tree-data="treeData"
    >
    </a-tree>
    <template #footer>
      <a-button type="primary" style="margin-right: 8px" @click="submit"
        >确定</a-button
      >
      <a-button @click="hideDrawer">取消</a-button>
    </template>
  </a-drawer>
</template>

<script setup>
import { ref, reactive, defineEmits, watch } from "vue";
import { httpAction, getAction } from "@/api/manage.js";
const emit = defineEmits(["submitSuccess"]);
const open = ref(false);
const httpUrl = reactive({
  list: "SystemPermission/routePermissions-list",
  set: "SystemPermission/routePermissions-set",
});
const fieldNames = reactive({
  children: "children",
  title: "menu_name",
  key: "id",
});
let roleId = ref("");
const afterOpenChange = (bool) => {
  console.log("open", bool);
  if (!bool) {
    resetModel();
  }
};
const resetModel = () => {
  treeData.splice(0);
  checkedKeys.value.splice(0);
};
const hideDrawer = () => {
  resetModel();
  open.value = false;
};
let treeData = reactive([]);
let expandedKeys = ref([]);
let selectedKeys = ref([]);
let checkedKeys = ref([]);

watch(expandedKeys, () => {
  console.log("expandedKeys", expandedKeys);
});
watch(selectedKeys, () => {
  console.log("selectedKeys", selectedKeys);
});
watch(checkedKeys, () => {
  console.log("checkedKeys", checkedKeys);
});

const showDrawer = (param = {}) => {
  roleId.value = param.id;
  getMenu();
};
const getMenu = (param) => {
  getAction(httpUrl.list, {
    id:roleId.value
  })
    .then((result) => {
      treeData.push(...result.data.list);
      checkedKeys.value.push(...result.data.route_authority);
      open.value = true;
    })
    .catch((err) => {});
};

const submit = () => {
  let route_authority = Array.from(checkedKeys.value).join(",");
  httpAction(
    httpUrl.set,
    {
      route_authority: route_authority,
      id: roleId.value,
    },
    "put"
  )
    .then((result) => {
      console.log(result);
      if (result.code === "0000") {
        open.value = false;
        emit("submitSuccess");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

defineExpose({
  showDrawer,
});
</script>

<style lang="less" scoped></style>