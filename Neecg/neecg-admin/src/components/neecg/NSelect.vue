<template>
  <a-select
    ref="select"
    v-model:value="localValue"
    style="width: 100%"
    @focus="focus"
    @change="handleChange"
    :placeholder="placeholder"
  >
    <a-select-option
      :value="item.id"
      v-for="(item, index) in list"
      :key="index"
      >{{ item.role_name }}</a-select-option
    >
  </a-select>
</template>

<script setup>
import { ref, reactive, defineProps, computed } from "vue";
import { selectList } from "@/api/api";
const props = defineProps({
  dict: String,
  modelValue: String,
  placeholder:String
});
// 使用 defineEmits 定义事件
const emit = defineEmits(["update:modelValue"]);

const focus = () => {
  console.log("focus");
};
const handleChange = (value) => {
  console.log(`selected ${value}`);
};
const list = reactive([]);

selectList({ dict: props.dict })
  .then((result) => {
    if (!result) return;
    // 更新 list 数组
    list.splice(0, list.length, ...result.data);
    console.log(list);
  })
  .catch((err) => {
    console.log(err);
  });

// 创建计算属性，绑定本地值和父组件的 v-model
const localValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>

<style>
</style>