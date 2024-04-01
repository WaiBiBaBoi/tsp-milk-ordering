<template>
  <div class="home-container">
    <div class="carousel-container">
      <Carousel></Carousel>
    </div>
    <div class="product-container container">
      <div class="title-container">
        <div class="text">严选优质</div>
        <hr />
      </div>
      <div class="list-container row">
        <div class="product-item col-4" v-for="(item,index) in list1" :key="index">
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
      <div class="more-button" @click="goProduct">更多精品</div>
    </div>
    <div class="product-container container">
      <div class="title-container">
        <div class="text">新品上架</div>
        <hr />
      </div>
      <div class="list-container row">
        <div class="product-item col-4" v-for="(item,index) in list2" :key="index">
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
      <div class="more-button">更多精品</div>
    </div>
    <div class="about-container container">
      <div class="title-container">
        <div class="text">关于我们</div>
        <hr />
      </div>
      <div class="content-container">
        <div class="row">
          <div class="col-sm-6">
            <p class="text">
              萌牛集团（简称“萌牛”）1999年成立于内萌古自治区，总部位于呼和浩特，是全球乳业八强。
              2004年在香港上市（股票代码2319.HK），是恒生指数、恒生中国企业指数和恒生可持续发展企业指数成分股。
              中粮集团有限公司是萌牛第一大战略股东。萌牛专注于为中国和全球消费者提供营养、健康、美味的乳制品，
              形成了包括液态奶、冰淇淋、奶粉、奶酪等品类在内的丰富产品矩阵；
              拥有特仑苏、纯甄、冠益乳、优益C、每日鲜语、蒂兰圣雪、瑞哺恩、贝拉米、妙可蓝多、爱氏晨曦等明星品牌。在高端纯牛奶、低温酸奶、
              高端鲜奶、奶酪等领域，市场份额处于领先地位。除中国内地外，萌牛产品还进入了东南亚、大洋洲、北美等区域的十余个国家和地区市场。
              2022年，萌牛实现全年收入925.9亿元，经营利润为54.2亿元。
            </p>
            
            <p class="tag">· 精选奶源</p>
            <p class="tag">· 优质服务</p>
            <p class="tag">· 品质保证</p>
            <p class="tag">· 退换无忧</p>
          </div>
          <div class="col-sm-6">
            <div class="image">
                <img src="../assets/about.png" alt="">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive,onMounted } from "vue";
import Carousel from "../components/home-carousel.vue";
import { httpAction, getAction } from "../api/manage.js";
import { useRouter } from 'vue-router';
const route = useRouter();
let list1 = reactive([])
let list2 = reactive([])
const getList1 = () => {
  getAction('Product/getBoutiqueProduct',{}).then((res) => {
    if(res.code === '0000'){
      list1.splice(0,list1.length)
      for(let i = 0; i < res.data.length; i++){
        res.data[i].image = res.data[i].images.split(',')[0]
        res.data[i].price = res.data[i].commoditys[0].price
        res.data[i].text = res.data[i].commoditys[0].commodity_name
      }
      list1.push(...res.data)
    }
  })
}
const getList2 = () => {
  getAction('Product/getNewProductList',{}).then((res) => {
    if(res.code === '0000'){
      list2.splice(0,list1.length)
      for(let i = 0; i < res.data.length; i++){
        res.data[i].image = res.data[i].images.split(',')[0]
        res.data[i].price = res.data[i].commoditys[0].price
        res.data[i].text = res.data[i].commoditys[0].commodity_name

      }
      list2.push(...res.data)
    }
  })
}
const getSales = (num) => {
  return num > 999 ? '999+' : num
}
const getComments = (num) => {
  return num > 999 ? '99+' : num
}
const goProduct = () => {
  const routeLocation = route.resolve({
    path: '/product', // 在这里替换为目标路由的名称，或者直接使用 path: '/your-path'
  });
  // 使用 window.open 打开新窗口到目标路由
  // routeLocation.href 会给出我们基于当前路由配置解析出的完整 URL
  window.open(routeLocation.href, '_blank');
}
onMounted(() => {
  getList1()
  getList2()
});
</script>

<style lang="less" scoped>
.carousel-container {
  height: calc(100vh - 60px);
}
.product-container {
  padding: 50px 0;
}
.title-container {
  padding-bottom: 30px;
  .text {
    font-size: 24px;
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
.more-button {
  text-align: center;
  font-weight: bold;
  font-size: 20px;
  cursor: pointer;
}
.more-button:hover {
  color: #f33f3f;
}
.about-container{
  padding-top: 50px;
}
.content-container{
    .text{
        text-indent: 2em;
        line-height: 24px;
    }
    .tag{
        color: #007bff;
    }
    .image{
        width: 100%;
        img{
            width: 100%;
        }
    }
}
</style>