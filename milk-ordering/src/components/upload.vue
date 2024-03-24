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
import axios from "axios";

const fileList = ref([]);
const uploadLimit = 5; // 设置上传数量限制

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
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    alert("Image must be smaller than 2MB!");
    return Promise.reject(new Error("File too large"));
  }
  return true;
}

function handleChange({ file, fileList: newFileList }) {
  if (file.status === "done") {
    // 通常服务器会在响应中返回文件信息，包括文件URL
    file.url = file.response.url;
  } else if (file.status === "error") {
    alert(`File upload failed: ${file.name}`);
  }
  fileList.value = newFileList;
}

function customUpload(options) {
  const { onSuccess, onError, file, onProgress } = options;

  const formData = new FormData();
  formData.append("file", file);

  axios
    .post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        onProgress({
          percent: (progressEvent.loaded / progressEvent.total) * 100,
        });
      },
    })
    .then((response) => {
      onSuccess(response.data, file);
    })
    .catch(onError);
}
</script>
  
  <style>
/* 样式内容 */
</style>