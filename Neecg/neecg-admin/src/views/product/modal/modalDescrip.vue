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
    <a-descriptions  layout="vertical" bordered>
      <a-descriptions-item label="Product">Cloud Database</a-descriptions-item>
      <a-descriptions-item label="Billing Mode">Prepaid</a-descriptions-item>
      <a-descriptions-item label="Automatic Renewal">YES</a-descriptions-item>
      <a-descriptions-item label="Order time"
        >2018-04-24 18:00:00</a-descriptions-item
      >
      <a-descriptions-item label="Usage Time" :span="2"
        >2019-04-24 18:00:00</a-descriptions-item
      >
      <a-descriptions-item label="Status" :span="3">
        <a-badge status="processing" text="Running" />
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
    default: "Basic Drawer"
  },
})
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