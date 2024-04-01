<template>
  <a-upload
    :file-list="fileList"
    :before-upload="beforeUpload"
    :custom-request="customUpload"
    list-type="picture-card"
    @change="handleChange"
  >
    <div v-if="fileList.length < uploadLimit">
      <a-icon type="plus" />
      <div style="margin-top: 8px">Upload</div>
    </div>
  </a-upload>
</template>
  
  <script setup>
import { reactive, ref, watch } from "vue";
import { uploadAction } from "@/api/manage";

const props = defineProps({
  limit: {
    type: Number,
    default: 1,
  },
  modelValue: String,
});
const emit = defineEmits(["update:modelValue"]);
let fileList = ref(
  (() => {
    if (props.modelValue) {
      let arr = props.modelValue.split(",");
      let result = [];
      for (let i = 0; i < arr.length; i++) {
        result.push({
          url: arr[i],
        });
      }
      return result;
    } else {
      return [];
    }
  })()
);
watch(
  () => props.modelValue,
  (newValue, oldValue) => {
    getFileList(newValue);
  }
);
const uploadLimit = props.limit; // 设置上传数量限制
const getFileList = (str) => {
  if (str) {
    fileList.value.splice(0, fileList.value.length);
    let arr = str.split(",");
    for (let i = 0; i < arr.length; i++) {
      fileList.value.push({
        url: arr[i],
      });
    }
  }
};
const updateModelValue = () => {
  // 仅当路径数组变更时更新父组件的v-model绑定值
  let arr = [];
  for (let i = 0; i < fileList.value.length; i++) {
    arr.push(fileList.value[i].url);
  }
  emit("update:modelValue", arr.join(","));
};
function beforeUpload(file) {
  if (fileList.value.length >= uploadLimit) {
    alert(`You can only upload ${uploadLimit} images.`);
    return Promise.reject(new Error("Upload limit reached"));
  }

  // 检查文件类型和大小
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    alert("You can only upload JPG or PNG files!");
    return Promise.reject(new Error("Incorrect file type"));
  }
  // const isLt2M = file.size / 1024 / 1024 < 2;
  // if (!isLt2M) {
  //   alert("Image must be smaller than 2MB!");
  //   return Promise.reject(new Error("File too large"));
  // }
  return true;
}

function handleChange({ file, fileList: newFileList }) {
  //
  if (file.status === "done") {
    // 通常服务器会在响应中返回文件信息，包括文件URL
    file.url = file.response.filePath;
  } else if (file.status === "error") {
    alert(`File upload failed: ${file.name}`);
  } else if (file.status === "removed") {
  }
  // fileList.value = newFileList;
  updateModelValue();
}

function customUpload(options) {
  const { onSuccess, onError, file, onProgress } = options;
  const formData = new FormData();
  formData.append("file", file);
  uploadAction("/upload/file", formData, onProgress)
    .then((response) => {
      console.log(response);
      fileList.value.push({
        url: response.filePath
      });
      updateModelValue()
      onSuccess(response, file);
    })
    .catch(onError);
}
</script>
  
  <style>
/* 样式内容 */
</style>