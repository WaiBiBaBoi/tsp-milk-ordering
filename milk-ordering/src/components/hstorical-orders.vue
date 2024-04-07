<template>
  <div class="current-order-container">
    <div class="list">
      <div class="item" v-for="item in orderList" :key="item.id">
        <div class="flex-between">
          <div class="order-info">
            <div class="image">
              <img :src="item.image" alt="" />
            </div>
            <div class="info flex-align-between">
              <div>
                <h5>{{ item.product_name }}</h5>
                <p>{{ item.commodity_name }}</p>
                <div class="order-state">收货人：{{ item.receiver }}</div>
                <div class="order-state">联系方式：{{ item.phone }}</div>
                <div class="address-text">收货地址：{{ item.address }}</div>
                <div class="order-state">
                  订单状态：{{ item.order_status }}
                  <span style="color: red" v-if="item.order_status == 1"
                    >；取消原因：{{ item.abort_reason }}</span
                  >
                </div>
              </div>
              <div class="price">x{{ item.quantity }} ￥{{ item.price }}</div>
            </div>
          </div>
          <div class="operate-buttom">
            <div class="order-state">订单号：{{ item.id }}</div>
            <div style="display: flex; justify-content: flex-end">
              <div
              class="edit-address-button"
              data-bs-toggle="modal"
              data-bs-target="#comment-modal"
            >
              评论
            </div>
            </div>
          </div>
        </div>
        <hr />
      </div>
    </div>
    <modal id="comment-modal" title="商品评论" width="600px">
      <a-form
        :model="commentParam"
        layout="horizontal"
        name="basic"
        ref="formRef"
        :rules="commentRules"
        autocomplete="off"
        @finish="commentFinish"
        @finishFailed="commentFinishFailed"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
      >
        <a-form-item label="评论" name="comment">
          <a-textarea  v-model:value="commentParam.comment" :rows="3" />
        </a-form-item>
        <a-form-item label="图像" name="images">
          <upload v-model="commentParam.images"></upload>
        </a-form-item>
      </a-form>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
          关闭
        </button>
        <button
          type="button"
          class="btn btn-primary"
          ref="okButton"
          :data-bs-dismiss="bool ? 'modal' : ''"
          @click="handleComment"
        >
          确定
        </button>
      </div>
    </modal>
  </div>
</template>
  
  <script setup>
import { ref, reactive } from "vue";
import modal from "../components/modal.vue";
import upload from "../components/upload.vue";
import { httpAction, getAction } from "../api/manage.js";
let okButton = ref(null);
let formRef = ref(null);
let bool = ref(false);
let orderList = reactive([]);
let commentParam = reactive({
  comment:'',
  images:''
})
let commentRules = reactive({
  comment: [
    {
      required: true,
      message: "请填写退货原因!",
      trigger: "blur",
    },
  ],
  // images: [
  //   {
  //     required: true,
  //     message: "请上传退货原因图片!",
  //     trigger: "blur",
  //   },
  // ],
})
const getOrderList = () => {
  getAction("Order/userHistoryOrder", {}).then((res) => {
    if (res.code === "0000") {
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].image) {
          res.data[i].image = res.data[i].image.split(",")[0];
        }
      }
      orderList.splice(0, orderList.length);
      orderList.push(...res.data);
    }
  });
};
getOrderList();
const commentFinish = (values) => {
  console.log("Success:", values);
};
const commentFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
const handleComment = () => {

}
</script>
  
  <style lang="less" scoped>
.current-order-container {
  padding: 20px;
}
.list {
  .item {
    .order-info {
      display: flex;
      .image {
        width: 180px;
        height: 180px;
        img {
          width: 100%;
          height: 100%;
          border-radius: 3px;
        }
      }
      .info {
        margin-left: 15px;
        .price {
          color: #f33f3f;
        }
        .address-text {
          font-size: 14px;
          margin-bottom: 6px;
        }
        .order-state {
          font-size: 14px;
        }
      }
    }
    .operate-buttom {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      font-size: 14px;
      .cancel-button {
        color: #f33f3f;
        cursor: pointer;
      }
      .edit-address-button {
        color: #007bff;
        cursor: pointer;
      }
    }
  }
}
</style>