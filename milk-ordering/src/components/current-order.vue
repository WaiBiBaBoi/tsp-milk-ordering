<template>
  <div class="current-order-container">
    <div class="list">
      <div class="item" v-for="item in 2" :key="item">
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
            <div style="display: flex">
              <div
                class="edit-address-button"
                data-toggle="modal"
                data-target="#edit-address-modal"
              >
                修改地址
              </div>
              <a-popconfirm
                title="Are you sure delete this task?"
                ok-text="Yes"
                cancel-text="No"
                @confirm="confirm"
              >
                <div class="cancel-button">取消订单</div>
              </a-popconfirm>
              <a-popconfirm
                title="Are you sure delete this task?"
                ok-text="Yes"
                cancel-text="No"
                @confirm="confirm"
              >
                <div class="edit-address-button">确认收货</div>
              </a-popconfirm>
              <div
                class="cancel-button"
                data-toggle="modal"
                data-target="#chargeback-modal"
              >
                退换商品
              </div>
            </div>
          </div>
        </div>
        <hr />
      </div>
    </div>
    <modal id="edit-address-modal" title="修改地址" width="600px">
      <a-form
        :model="editAddressParam"
        layout="horizontal"
        name="basic"
        ref="formRef"
        :rules="editAddressRules"
        autocomplete="off"
        @finish="editAddressFinish"
        @finishFailed="editAddressFinishFailed"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
      >
        <a-form-item label="收货人" name="name">
          <a-input v-model:value="editAddressParam.name" />
        </a-form-item>

        <a-form-item label="联系方式" name="phone">
          <a-input v-model:value="editAddressParam.phone" />
        </a-form-item>
        <a-form-item label="收货地址" name="address">
          <a-input v-model:value="editAddressParam.address" />
        </a-form-item>
      </a-form>
    </modal>
    <modal id="chargeback-modal" title="退换原因" width="600px">
      <a-form
        :model="chargebackParam"
        layout="horizontal"
        name="basic"
        ref="formRef"
        :rules="chargebackRules"
        autocomplete="off"
        @finish="chargebackFinish"
        @finishFailed="chargebackFinishFailed"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
      >
        <a-form-item label="原因" name="name">
          <a-textarea  v-model:value="chargebackParam.text" :rows="3" />
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

let editAddressParam = reactive({
  name: "",
  phone: "",
  address: "",
});
let editAddressRules = reactive({
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
const editAddressFinish = (values) => {
  console.log("Success:", values);
};
const editAddressFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
let chargebackParam = reactive({
  text:'',
  images:''
})
let chargebackRules = reactive({

})
const chargebackFinish = (values) => {
  console.log("Success:", values);
};
const chargebackFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
const confirm = (e) => {
  console.log(e);
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
        margin-right: 10px;
      }
      .edit-address-button {
        color: #007bff;
        cursor: pointer;
        margin-right: 10px;
      }
    }
  }
}
.col-form-label {
  padding: 0;
  padding-left: 10px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>