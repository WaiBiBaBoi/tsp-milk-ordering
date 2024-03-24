<template>
  <div class="product-details-container container">
    <div class="product-info-container">
      <div class="row">
        <div class="col-6 carousel-container">
          <Carousel></Carousel>
        </div>
        <div class="col-6">
          <div class="flex-align-between">
            <div class="product-info">
              <h4>伊利纯牛奶</h4>
              <p>整箱250ml*21盒 全脂牛奶 优质乳蛋白早餐伴侣 礼盒装</p>
              <h4 class="price">￥49</h4>
              <div class="product-style">
                <div class="style-item" v-for="item in 5" :key="item">
                  【镇店爆款】2{{ item }}盒纯牛奶
                </div>
              </div>
            </div>
            <div>
              <div style="padding-bottom: 12px">
                <span>销量：999+</span>
                <span>库存：有货</span>
              </div>
              <div style="display: flex">
                <div style="width: 160px; margin-right: 15px">
                  <div class="input-group">
                    <div class="input-group-prepend" style="width: 40px">
                      <button
                        style="width: 100%"
                        class="btn btn-outline-secondary"
                        type="button"
                        id="button-addon1"
                      >
                        -
                      </button>
                    </div>
                    <input
                      style="text-align: center"
                      type="text"
                      class="form-control"
                      placeholder=""
                      aria-label="Example text with button addon"
                      aria-describedby="button-addon1"
                    />
                    <div class="input-group-append" style="width: 40px">
                      <button
                        style="width: 100%"
                        class="btn btn-outline-secondary"
                        type="button"
                        id="button-addon2"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <div
                  class="add-button"
                  data-toggle="modal"
                  data-target="#add-order-modal"
                >
                  立即购买
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="title-container flex-between">
      <div class="text">购买评论</div>
      <div><span class="num">224</span> 条</div>
    </div>
    <hr />
    <div class="comment-container">
      <div class="list">
        <div class="item" v-for="item in 10" :key="item">
          <div class="media">
            <img src="..." class="align-self-start mr-3" alt="..." />
            <div class="media-body">
              <h5 class="mt-0">Top-aligned media</h5>
              <p>
                I’m gon’ put her in a coma. You give a hundred reasons why, and
                you say you're really gonna try. So I sat quietly, agreed
                politely. Suiting up for my crowning battle. And on my 18th
                Birthday we got matching tattoos. So très chic, yeah, she's a
                classic. I am ready for the road less traveled.
              </p>
            </div>
          </div>
          <hr />
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
    <modal id="add-order-modal" title="填写订单信息" width="600px">
      <a-form
        :model="orderInfoParam"
        layout="horizontal"
        name="basic"
        ref="formRef"
        :rules="orderInfoRules"
        autocomplete="off"
        @finish="orderInfoFinish"
        @finishFailed="orderInfoFinishFailed"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
      >
        <a-form-item label="收货人" name="name">
          <a-input v-model:value="orderInfoParam.name" />
        </a-form-item>

        <a-form-item label="联系方式" name="phone">
          <a-input v-model:value="orderInfoParam.phone" />
        </a-form-item>
        <a-form-item label="收货地址" name="address">
          <a-input v-model:value="orderInfoParam.address" />
        </a-form-item>
      </a-form>
    </modal>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import Carousel from "../components/details-carousel.vue";
import modal from "../components/modal.vue";
let orderInfoParam = reactive({
  name: "",
  phone: "",
  address: "",
});
let orderInfoRules = reactive({
  name: [
    {
      required: true,
      message: "Please input your mobile phone number!",
      trigger: "blur",
    },
  ],
  phone: [
    {
      required: true,
      message: "Please input your mobile phone number!",
      trigger: "blur",
    },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: "Invalid Chinese mainland mobile phone number!",
      trigger: ["blur", "change"],
    },
  ],
  address: [
    {
      required: true,
      message: "Please input your mobile phone number!",
      trigger: "blur",
    },
  ],
});
const orderInfoFinish = (values) => {
  console.log("Success:", values);
};
const orderInfoFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
</script>

<style lang="less" scoped>
.product-details-container {
  padding: 50px 0;
}
.product-info-container {
  padding-bottom: 150px;
  .carousel-container {
    height: 400px;
  }
  .product-info {
    .price {
      color: #f33f3f;
    }
    .product-style {
      display: flex;
      flex-wrap: wrap;
      .style-item {
        border: 1px solid #ccc;
        border-radius: 2px;
        padding: 4px 12px;
        font-size: 14px;
        margin-right: 15px;
        margin-bottom: 15px;
        cursor: pointer;
      }
    }
  }
}
.title-container {
  padding-top: 30px;
  align-items: flex-end;
  .text {
    font-size: 24px;
  }
  .num {
    color: #f33f3f;
  }
}
.pagination-container {
  display: flex;
  justify-content: center;
}
.add-button {
  font-weight: bold;
  background: #f33f3f;
  padding: 0 20px;
  line-height: 38px;
  display: inline-block;
  font-weight: bold;
  font-size: 20px;
  color: #fff;
  cursor: pointer;
}
.add-button:active {
  background: red;
}
</style>