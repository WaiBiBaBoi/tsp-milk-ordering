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
      <a-descriptions-item label="产品名称" :span="3">{{
        model.product_name
      }}</a-descriptions-item>
      
      <a-descriptions-item label="优选" :span="3">
        <a-tag color="green" v-if="model.boutique">开启</a-tag>
        <a-tag color="red" v-else>未开启</a-tag>
      </a-descriptions-item>
      <a-descriptions-item label="状态" :span="3">
        <a-tag color="green" v-if="model.is_available">上架</a-tag>
        <a-tag color="red" v-else>下架</a-tag>
      </a-descriptions-item>
      <!-- <a-descriptions-item label="图片" :span="3">
        <a-image :width="200" :src="item" v-for="(item,index) in images" :key="index" />
      </a-descriptions-item> -->
      <a-descriptions-item label="备注" :span="3">{{
        model.introduction
      }}</a-descriptions-item>
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
    default: "产品详情",
  },
});
let model = reactive();
let images = reactive([])
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
  if(model.images){
    images.splice(0,images.length)
  images.push(...model.images.split(','))
  }
  console.log(images);
  open.value = true;
};

defineExpose({
  showDrawer,
});
</script>

<style lang="less" scoped></style>