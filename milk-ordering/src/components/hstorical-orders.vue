<template>
  <div class="current-order-container">
    <div class="list">
      <div class="item" v-for="item in 5" :key="item">
        <div class="flex-between">
          <div class="order-info">
            <div class="image">
              <img
                src="https://img11.360buyimg.com/n7/jfs/t1/134855/32/42036/144241/65fa8f08F818de655/8cb02f8a670eb286.jpg"
                alt=""
              />
            </div>
            <div class="info flex-align-between">
              <div>
                <h5>伊利纯牛奶</h5>
                <p>整箱250ml*21盒 全脂牛奶 优质乳蛋白早餐伴侣 礼盒装</p>
                <div class="order-state">收货人：杀马特团长</div>
                <div class="order-state">联系方式：136xxxxxx08</div>
                <div class="address-text">
                  收货地址：广西壮族自治区南宁市那洪街道汇东星世界1170菜鸟驿站
                </div>
                <div class="order-state">订单状态：未发货</div>
              </div>
              <div class="price">x2 ￥89</div>
            </div>
          </div>
          <div class="operate-buttom">
            <div
              class="edit-address-button"
              data-toggle="modal"
              data-target="#comment-modal"
            >
              去评论
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
        <a-form-item label="评论" name="name">
          <a-textarea  v-model:value="commentParam.text" :rows="3" />
        </a-form-item>
        <a-form-item label="图像" name="address">
          <upload></upload>
        </a-form-item>
      </a-form>
    </modal>
  </div>
</template>
  
  <script setup>
import { ref, reactive } from "vue";
import modal from "../components/modal.vue";
import upload from "../components/upload.vue";
let commentParam = reactive({
  text:'',
  images:''
})
let commentRules = reactive({

})
const commentFinish = (values) => {
  console.log("Success:", values);
};
const commentFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
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
      justify-content: flex-end;
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