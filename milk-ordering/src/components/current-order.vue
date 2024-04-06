<template>
  <div class="current-order-container">
    <div class="list">
      <div class="item" v-for="item in orderList" :key="item.id">
        <div class="flex-between">
          <div class="order-info">
            <div class="image">
              <img
                :src="item.image"
                alt=""
              />
            </div>
            <div class="info flex-align-between">
              <div>
                <h5>{{item.product_name}}</h5>
                <p>{{item.commodity_name}}</p>
                <div class="order-state">收货人：{{item.receiver}}</div>
                <div class="order-state">联系方式：{{ item.phone }}</div>
                <div class="address-text">
                  收货地址：{{item.address}}
                </div>
                <div class="order-state">订单状态：{{item.order_status}} <span style="color: red;" v-if="item.order_status == 1">；取消原因：{{ item.abort_reason }}</span> </div>
              </div>
              <div class="price">x{{item.quantity}} ￥{{item.price}}</div>
            </div>
          </div>
          <div class="operate-buttom ">
            <div class="order-state">订单号：{{item.id}}</div>
            <div style="display: flex;justify-content: flex-end;">
              <div
                class="edit-address-button"
                data-bs-toggle="modal"
                data-bs-target="#edit-address-modal"
              >
                修改地址
              </div>
              <a-popconfirm
                title="Are you sure delete this task?"
                ok-text="Yes"
                cancel-text="No"
                @confirm="cancelsOrder(item.id)"
                v-if="item.order_status == 0"
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
                data-bs-toggle="modal"
                data-bs-target="#chargeback-modal"
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
import { httpAction, getAction } from "../api/manage.js";

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
let orderList = reactive([])
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

const getOrderList = () => {
  getAction('Order/userOrder',{}).then((res) => {
    if(res.code === '0000'){
      for(let i = 0; i < res.data.length; i++){
        if(res.data[i].image){
          res.data[i].image =   res.data[i].image.split(',')[0]
        }
      }
      orderList.splice(0,orderList.length)
      orderList.push(...res.data)

    }
  })
}
getOrderList()
const cancelsOrder = (id) => {
  httpAction('Order/userCancelsOrder',{id},'put').then((res) => {

  })
}
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
      justify-content: space-between;
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