<template>
  <div class="product-container">
    <div class="image">
      <img src="../assets/bg1.jpg" alt="" />
    </div>
    <div class="container">
      <div class="title-container">
        <div class="text">优中选优</div>
        <hr />
      </div>
      <div class="search-container">
        <div class="input-group mb-3">
          <input
            type="text"
            class="form-control"
            placeholder="search"
            aria-label="Recipient's username"
            aria-describedby="button-addon2"
          />
          <div class="input-group-append">
            <button
              class="btn btn-outline-secondary"
              type="button"
              id="button-addon2"
            >
              搜索
            </button>
          </div>
        </div>
      </div>
      <div class="list-container row">
        <div class="product-item col-4" v-for="item in 6" :key="item">
          <div class="card" style="width: 18rem">
            <img src="..." class="card-img-top" alt="..." />
            <div class="card-body">
              <div class="flex-between" >
                <h5 class="card-title">Card title</h5>
                <h5 class="card-title price">￥49</h5>
              </div>
              <p class="card-text">
                Some quick example text to build on the card title and make up
                the bulk of the card's content.
              </p>
              <div class="flex-between">
                <div>销量：999+</div>
                <div>评论：99+</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="pagination-container">
        <nav aria-label="Page navigation example">
          <ul class="pagination">
            <li class="page-item"><a class="page-link" href="#">首页</a></li>
            <li class="page-item"><a class="page-link" href="#">1</a></li>
            <li class="page-item"><a class="page-link" href="#">2</a></li>
            <li class="page-item"><a class="page-link" href="#">3</a></li>
            <li class="page-item"><a class="page-link" href="#">尾页</a></li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style lang="less" scoped>
.image {
  height: 35vh;
  position: relative;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
.image::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
  opacity: 0.5;
}
.title-container {
  padding: 30px 0;
  .text {
    font-size: 24px;
  }
}
.search-container {
  padding-bottom: 20px;

  .input-group {
    width: 60%;
    margin: 0 auto;
  }
}
.list-container {
  .product-item {
    margin-bottom: 25px;
  }
  .card {
    width: 100% !important;
  }
}
.pagination-container {
  display: flex;
  justify-content: center;
}
</style>