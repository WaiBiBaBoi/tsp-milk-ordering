<template>
  <a-drawer
    width="600px"
    v-model:open="open"
    class="custom-class"
    root-class-name="root-class-name"
    :title="props.title"
    placement="right"
    @after-open-change="afterOpenChange"
  >
    <a-descriptions layout="vertical" bordered>
      <a-descriptions-item label="用户名" :span="3">{{
        model.user_name
      }}</a-descriptions-item>
      <a-descriptions-item label="用户账号" :span="3">{{
        model.user_account
      }}</a-descriptions-item>
      <a-descriptions-item label="用户余额" :span="3">{{
        model.money
      }}</a-descriptions-item>
      <a-descriptions-item label="收货默认手机号" :span="3">{{
        model.phone
      }}</a-descriptions-item>
      <a-descriptions-item label="收货默认地址" :span="3">{{
        model.address
      }}</a-descriptions-item>
      <!-- <a-descriptions-item label="状态" :span="3">
        <a-tag color="success" v-if="model.is_using">启用</a-tag>
        <a-tag color="error" v-else>关闭</a-tag>
      </a-descriptions-item> -->
      <a-descriptions-item label="用户头像" :span="3">
        <a-image :width="200" :src="model.avatar" />
      </a-descriptions-item>
    </a-descriptions>
    <template #footer>
      <a-button @click="hideDrawer">取消</a-button>
    </template>
  </a-drawer>
</template>

<script setup>
import { ref, reactive, defineEmits } from "vue";
import { httpAction } from "@/api/manage.js";
const props = defineProps({
  title: {
    type: String,
    default: "详情",
  },
});
let model = reactive({});
const emit = defineEmits(["submitSuccess"]);
const open = ref(false);

const afterOpenChange = (bool) => {
  console.log("open", bool);
  if (!bool) {
    resetModel();
  }
};
const resetModel = () => {
  for (let key in model) {
    model[key] = undefined;
  }
};
const hideDrawer = () => {
  resetModel();
  open.value = false;
};
const showDrawer = (param = {}) => {
  model = Object.assign({}, param);
  open.value = true;
};

defineExpose({
  showDrawer,
});
</script>

<style lang="less" scoped></style>