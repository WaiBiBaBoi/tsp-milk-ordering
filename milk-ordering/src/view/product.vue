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
            v-model="param.product_name"
          />
          <div class="input-group-append">
            <button
              class="btn btn-outline-secondary"
              type="button"
              id="button-addon2"
              @click="getList"
            >
              搜索
            </button>
          </div>
        </div>
      </div>
      <div class="list-container row">
        <div class="product-item col-3" @click="goDetail(item)" v-for="(item,index) in list" :key="index">
          <div class="card" style="width: 18rem">
            <img :src="item.image" class="card-img-top" alt="..." />
            <div class="card-body">
              <div class="flex-between" >
                <h5 class="card-title">{{item.product_name}}</h5>
                <h5 class="card-title price">￥{{item.price}}</h5>
              </div>
              <p class="card-text">
                {{item.text}}
              </p>
              <div class="flex-between">
                <div>销量：{{getSales(item.sales_volume)}}</div>
                <div>评论：{{getComments(item.comments.length)}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="pagination-container" style="padding: 30px 0;">
        <!-- <nav aria-label="Page navigation example">
          <ul class="pagination">
            <li class="page-item"><a class="page-link" href="#">首页</a></li>
            <li class="page-item"><a class="page-link" href="#">1</a></li>
            <li class="page-item"><a class="page-link" href="#">2</a></li>
            <li class="page-item"><a class="page-link" href="#">3</a></li>
            <li class="page-item"><a class="page-link" href="#">尾页</a></li>
          </ul>
        </nav> -->
        <a-pagination  v-if="commentsParam.pageSiz > 12" v-model:current="param.pageNo" @change="pageNoChange" :total="param.pageSize" show-less-items />
      </div>
    </div>
  </div>
</template>

<script setup>
import {reactive ,onMounted} from 'vue'
import { httpAction, getAction } from "../api/manage.js";
import { useRouter } from 'vue-router';
const route = useRouter();
let list = reactive([])
let param = {
  product_name:'',
  pageNo:1,
  pageSize:12
}
const getList = () => {
  getAction('Product/getProductList',param).then((res) => {
    if(res.code === '0000'){
      list.splice(0,list.length)
      for(let i = 0; i < res.data.rows.length; i++){
        res.data.rows[i].image = res.data.rows[i].images.split(',')[0]
        res.data.rows[i].price = res.data.rows[i].commoditys[0].price
        res.data.rows[i].text = res.data.rows[i].commoditys[0].commodity_name
      }
      list.push(...res.data.rows)
      param.pageSize = res.data.count
    }
  })
}

const getSales = (num) => {
  return num > 999 ? '999+' : num
}
const getComments = (num) => {
  return num > 999 ? '99+' : num
}
const pageNoChange = (e) => {
  param.pageNo = e
  getList()
}
const goDetail = (e) => {
  const routeLocation = route.resolve({
    path: '/product-detail', // 在这里替换为目标路由的名称，或者直接使用 path: '/your-path'
    query:{productid:e.id}
  });
  // 使用 window.open 打开新窗口到目标路由
  // routeLocation.href 会给出我们基于当前路由配置解析出的完整 URL
  window.open(routeLocation.href, '_blank');
}
onMounted(() => {
  getList()
})
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
    cursor: pointer;
    img{
      height: 300px;
      object-fit: cover;
    }
  }
  .card {
    width: 100% !important;
  }
  .price{
    color: #f33f3f;
  }
}
.pagination-container {
  display: flex;
  justify-content: center;
}
</style>