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
        <div class="carousel-image">
          <img
            :src="item"
            class="d-block w-100"
            :alt="'Slide ' + (index + 1)"
          />
        </div>
        <!-- Optional captions -->
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
import {reactive,onMounted,watch} from 'vue'
const props = defineProps({
  list:Array
})
watch(
  () => props.list,
  (newValue, oldValue) => {
    if(newValue.length){
      list.splice(0,list.length)
  list.push(...props.list)
    }
  }
)
let list = reactive([])
onMounted(() => {
  
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
  .carousel-image{
    border: 1px solid #CCC;
  }
</style>