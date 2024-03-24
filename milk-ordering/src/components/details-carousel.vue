<template>
  <div
        id="carouselExampleCaptions"
        class="carousel slide"
        data-ride="carousel"
      >
        <ol class="carousel-indicators">
          <li
            data-target="#carouselExampleCaptions"
            data-slide-to="0"
            class="active"
          ></li>
          <li data-target="#carouselExampleCaptions" data-slide-to="1"></li>
          <li data-target="#carouselExampleCaptions" data-slide-to="2"></li>
        </ol>
        <div class="carousel-inner">
          <div class="carousel-item active">
            <img src="..." class="d-block w-100" alt="..." />
            
          </div>
          <div class="carousel-item">
            <img src="..." class="d-block w-100" alt="..." />
            
          </div>
          <div class="carousel-item">
            <img src="..." class="d-block w-100" alt="..." />
            
          </div>
        </div>
        <button
          class="carousel-control-prev"
          type="button"
          data-target="#carouselExampleCaptions"
          data-slide="prev"
        >
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="sr-only">Previous</span>
        </button>
        <button
          class="carousel-control-next"
          type="button"
          data-target="#carouselExampleCaptions"
          data-slide="next"
        >
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="sr-only">Next</span>
        </button>
      </div>
</template>

<script setup>

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