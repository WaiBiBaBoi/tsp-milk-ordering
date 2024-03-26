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
import { ref } from "vue";
import {uploadAction} from '@/api/manage'
const props = defineProps({
  limit: {
    type: Number,
    default: 1
  },
})
const fileList = ref([]);
const uploadLimit = props.limit; // 设置上传数量限制

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
  console.log(file,'file');
  if (file.status === "done") {
    // 通常服务器会在响应中返回文件信息，包括文件URL
    file.url = file.response.filePath;
  } else if (file.status === "error") {
    alert(`File upload failed: ${file.name}`);
  }

  console.log( 'newFileList', newFileList);
  fileList.value = newFileList;
}

function customUpload(options) {
  //  
  const { onSuccess,onError, file ,onProgress } = options;

  const formData = new FormData();
  formData.append("file", file);
  uploadAction("/upload/file", formData,onProgress).then((response) => {
    console.log(response);
    
    onSuccess(response, file);
  }).catch(onError);

  
}
</script>
  
  <style>
/* 样式内容 */
</style>