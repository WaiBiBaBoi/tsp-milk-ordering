<template>
  <div class="product-details-container container">
    <div class="product-info-container">
      <div class="row">
        <div class="col-4 carousel-container">
          <Carousel :list="product.images"></Carousel>
        </div>
        <div class="col-8">
          <div class="flex-align-between">
            <div class="product-info">
              <h4>{{ product.product_name }}</h4>
              <p>{{ product.text }}</p>
              <h4 class="price">￥{{ product.price }}</h4>
              <div class="product-style">
                <div
                  class="style-item"
                  :class="index === commoditysActive ? 'commoditysActive' : ''"
                  v-for="(item, index) in product.commoditys"
                  :key="item"
                  @click="changeCommoditys(item, index)"
                >
                  {{ item.commodity_name }}
                </div>
              </div>
            </div>
            <div>
              <div style="padding-bottom: 12px; font-size: 14px">
                <span style="margin-right: 12px"
                  >销量：{{ getSales(product.sales_volume) }}；</span
                >
                <span>库存：{{product.reserve ? '有货' : '暂时缺货'}}；</span>
              </div>
              <div style="display: flex">
                <div style="width: 160px; margin-right: 15px">
                  <div class="input-group">
                    <button
                      class="btn btn-outline-secondary"
                      type="button"
                      id="button-addon1"
                      style="width: 40px"
                      @click="orderInfoParam.number--"
                    >
                      -
                    </button>
                    <input
                      type="text"
                      class="form-control"
                      placeholder=""
                      aria-label="Example text with button addon"
                      aria-describedby="button-addon1"
                      style="text-align: center;"
                      v-model="orderInfoParam.number"
                    />
                    <button
                      class="btn btn-outline-secondary"
                      type="button"
                      id="button-addon2"
                      style="width: 40px"
                      @click="orderInfoParam.number++"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div
                  class="add-button"
                  data-bs-toggle="modal"
                  data-bs-target="#add-order-modal"
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
      <div><span class="num">{{commentsLength(product.comments)}}</span> 条</div>
    </div>
    <hr />
    <div class="comment-container">
      <div class="list">
        <div class="item" v-for="item in product.comments" :key="item">
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
      <a-pagination v-if="commentsParam.pageSiz > 10"  v-model:current="commentsParam.pageNo" @change="pageNoChange" :total="commentsParam.pageSize" show-less-items  />
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
import { ref, reactive, onMounted,watch } from "vue";
import Carousel from "../components/details-carousel.vue";
import modal from "../components/modal.vue";
import { httpAction, getAction } from "../api/manage.js";
import { useRoute } from "vue-router";
const route = useRoute();
let orderInfoParam = reactive({
  name: "",
  phone: "",
  address: "",
  number:1
});
watch(() => orderInfoParam.number, (newValue, oldValue) => {
  console.log(newValue,'newValue');
  // 使用正则表达式检查输入是否为标准正整数
  if (!/^\d+$/.test(newValue) || newValue <= 0) {
    orderInfoParam.number = 1; // 如果不是，将值设置为1
  }
});
let commentsParam = {
  product_name:'',
  pageNo:1,
  pageSize:10
}
let product = reactive({});
let commoditysActive = ref(0);
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

const getSales = (num) => {
  return num > 999 ? "999+" : num;
};
const changeCommoditys = (item, index) => {
  if (index === commoditysActive) return;
  commoditysActive = index;
  product.price = item.price;
  product.text = item.commodity_name;
  product.reserve = item.reserve;
  product.images = item.images.split(",");
};
const commentsLength = (arr) => {
  return arr ? arr.length : 0
}
const pageNoChange = (e) => {
  commentsParam.pageNo = e
}
const getProduct = () => {
  getAction("Product/getProduct", {
    id: route.query.productid,
  }).then((res) => {
    if (res.code === "0000") {
      res.data.images = res.data.commoditys[0].images.split(",");
      for (let key in res.data) {
        product[key] = res.data[key];
      }
      product.price = res.data.commoditys[0].price;
      product.text = res.data.commoditys[0].commodity_name;
      product.reserve = res.data.commoditys[0].reserve;

      console.log();
    }
  });
};
onMounted(() => {
  getProduct();
});
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
        background-color: rgba(245, 245, 245, 0.5);
      }
      .commoditysActive {
        border-color: #f33f3f;
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