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
        v-for="(item, index) in list"
        :key="'slide-' + item.id"
        :class="{ active: index === 0 }"
      >
        <img :src="item.image" class="d-block w-100" :alt="'Slide ' + (index + 1)">
        <!-- Optional captions -->
        <div class="carousel-caption d-none d-md-block">
          <h5>{{ item.caption }}</h5>
          <p>{{ item.description }}</p>
        </div>
      </div>
    </div>
    <button class="carousel-control-prev" type="button" data-bs-target="#dynamic-carousel" data-bs-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#dynamic-carousel" data-bs-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </button>
  </div>
</template>

<script setup>
import {ref,reactive,onMounted} from 'vue'
import { httpAction, getAction } from "../api/manage.js";

let list = reactive([])
let sliding = ref(null)
let slide = ref(0);
const getList = () => {
  getAction('Carousel/listAll',{}).then((res) => {
    if(res.code === '0000'){
      list.splice(0,list.length)
      list.push(...res.data)
      console.log(list);
    }
  })
}
const onSlideStart = () => {
  sliding.value = true
}
const onSlideEnd = () => {
  sliding.value = false

}
onMounted(() => {
  getList()
})
</script>

<style lang="less" scoped>
.carousel {
    height: 100%;
    background-color: #555;
    .carousel-inner{
        height: 100%;
        .carousel-item{
            height: 100%;
        }
    }
  }
</style>