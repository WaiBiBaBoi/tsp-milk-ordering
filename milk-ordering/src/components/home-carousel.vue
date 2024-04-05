<template>
  <div id="dynamic-carousel" class="carousel slide" data-bs-ride="carousel">
    <div class="carousel-indicators">
      <button
        type="button"
        v-for="(item, index) in list"
        :key="'indicator-' + item.id"
        :data-bs-target="'#dynamic-carousel'"
        :data-bs-slide-to="index"
        :class="{ active: index === 0 }"
        :aria-label="'Slide ' + (index + 1)"
      ></button>
    </div>
    <div class="carousel-inner">
      <div
        class="carousel-item"
        @click="goDetail(item)"
        v-for="(item, index) in list"
        :key="'slide-' + item.id"
        :class="{ active: index === 0 }"
      >
        <div class="carousel-image">
          <img
            :src="item.image"
            class="d-block w-100"
            :alt="'Slide ' + (index + 1)"
          />
        </div>
        <!-- Optional captions -->
        <!-- <div class="carousel-caption d-none d-md-block">
          <h5>{{ item.title }}</h5>
          <p>{{ item.introduction }}</p>
        </div> -->
      </div>
    </div>
    <button
      class="carousel-control-prev"
      type="button"
      data-bs-target="#dynamic-carousel"
      data-bs-slide="prev"
    >
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    </button>
    <button
      class="carousel-control-next"
      type="button"
      data-bs-target="#dynamic-carousel"
      data-bs-slide="next"
    >
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </button>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { httpAction, getAction } from "../api/manage.js";
import { useRouter } from "vue-router";
const route = useRouter();
let list = reactive([]);
let sliding = ref(null);
let slide = ref(0);
const getList = () => {
  getAction("Carousel/listAll", {}).then((res) => {
    if (res.code === "0000") {
      list.splice(0, list.length);
      list.push(...res.data);
      console.log(list);
    }
  });
};
const goDetail = (item) => {
  if(item.product_id){
    const routeLocation = route.resolve({
    path: "/product-detail", // 在这里替换为目标路由的名称，或者直接使用 path: '/your-path'
    query: { productid: item.product_id },
  });
  // 使用 window.open 打开新窗口到目标路由
  // routeLocation.href 会给出我们基于当前路由配置解析出的完整 URL
  window.open(routeLocation.href, "_blank");
  }
}
const onSlideStart = () => {
  sliding.value = true;
};
const onSlideEnd = () => {
  sliding.value = false;
};
onMounted(() => {
  getList();
});
</script>

<style lang="less" scoped>
.carousel {
  height: 100%;
  background-color: #555;
  .carousel-inner {
    height: 100%;
    .carousel-item {
      height: 100%;
      cursor: pointer;
    }
  }
}
.carousel-image {
  width: 100%;
  height: 100%;
  position: relative;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
.carousel-image::before {
  content: "";
  position: absolute;
  background-color: rgba(51, 51, 51, 0.3);
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* 设置透明度为 0.5 */
  /* 确保伪元素位于内容下方 */
}
</style>