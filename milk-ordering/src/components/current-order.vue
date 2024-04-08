<template>
  <div class="current-order-container">
    <div class="list">
      <div class="item" v-for="item in orderList" :key="item.id" @click.stop="goDetail(item)">
        <!--  -->
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
                  订单状态：{{ status_arr[item.order_status].text  }}
                </div>
              </div>
              <div class="price">x{{ item.quantity }} ￥{{ item.price }}</div>
            </div>
          </div>
          <div class="operate-buttom">
            <div>
              <div class="order-state">订单号：{{ item.id }}</div>
              <div class="order-state"  v-if="item.delivery">配送员：{{ item.delivery.delivery_name }}</div>
              <div class="order-state" v-if="item.delivery">手机号：{{ item.delivery.phone }}</div>
            </div>
            <div style="display: flex; justify-content: flex-end">
              <!-- <div
                class="edit-address-button"
                data-bs-toggle="modal"
                data-bs-target="#edit-address-modal"
              >
                修改地址
              </div> -->
              <a-popconfirm
                title="您确定要取消该订单?"
                ok-text="是"
                cancel-text="否"
                @confirm="cancelsOrder(item.id)"
                v-if="item.order_status == 0"
              >
                <div class="cancel-button" @click.stop>取消订单</div>
              </a-popconfirm>
              <a-popconfirm
                title="货物已经到手?"
                ok-text="是"
                cancel-text="否"
                @confirm="confirmReceipt(item.id)"
                v-if="item.order_status == 5"
              >
                <div class="edit-address-button" @click.stop>确认收货</div>
              </a-popconfirm>
              <div
                class="cancel-button"
                data-bs-toggle="modal"
                data-bs-target="#chargeback-modal"
                @click.stop="chargebackParam.id = item.id"
                v-if="item.order_status == 5"
              >
                退换商品
              </div>
            </div>
          </div>
        </div>
        <hr />
      </div>
    </div>
    <!-- <modal id="edit-address-modal" title="修改地址" width="600px">
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
    </modal> -->
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
        <a-form-item label="原因" name="return_message">
          <a-textarea
            v-model:value="chargebackParam.return_message"
            :rows="3"
          />
        </a-form-item>
        <a-form-item label="图像" name="return_images">
          <upload v-model="chargebackParam.return_images"></upload>
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
          @click="returnApplication"
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
import { useRouter } from "vue-router";
const route = useRouter();
let okButton = ref(null);
let formRef = ref(null);
let bool = ref(false);

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
let orderList = reactive([]);
const editAddressFinish = (values) => {
  console.log("Success:", values);
};
const editAddressFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
let chargebackParam = reactive({});
let chargebackRules = reactive({
  return_message: [
    {
      required: true,
      message: "请填写退货原因!",
      trigger: "blur",
    },
  ],
  return_images: [
    {
      required: true,
      message: "请上传退货原因图片!",
      trigger: "blur",
    },
  ],
});
const status_arr = reactive([
  {
    text: "已下单",
    value: 0,
  },
  {
    text: "商家取消订单",
    value: 1,
  },
  {
    text: "已取消订单",
    value: 2,
  },
  {
    text: "商家已接单",
    value: 3,
  },
  {
    text: "配送中",
    value: 4,
  },
  {
    text: "配送完成",
    value: 5,
  },
  {
    text: "确认收货",
    value: 6,
  },
  {
    text: "退换申请中",
    value: 7,
  },
  {
    text: "商家同意退换",
    value: 8,
  },
  {
    text: "商家拒绝退换",
    value: 9,
  },
]);
const chargebackFinish = (values) => {
  console.log("Success:", values);
};
const chargebackFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

const getOrderList = () => {
  getAction("Order/userCurrentOrder", {}).then((res) => {
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
const cancelsOrder = (id) => {
  httpAction("Order/userCancelsOrder", { id }, "put").then((res) => {
    if (res.code === "0000") {
      setTimeout(() => {
        getOrderList();
      },500)
    }
  });
};
const confirmReceipt = (id) => {
  httpAction("Order/confirmReceipt", { id }, "put").then((res) => {
    if (res.code === "0000") {
      setTimeout(() => {
        getOrderList();
      },500)
    }
  });
};
const returnApplication = async () => {
  try {
    if (bool.value) return;
    bool.value = true;
    await formRef.value.validate()
    httpAction("Order/returnApplication", chargebackParam, "put")
      .then((res) => {
        if (res.code === "0000") {
          okButton.value.click();
          setTimeout(() => {
        getOrderList();
      },500)
          bool.value = false;
        }
      })
      .catch((err) => {
        bool.value = false;
      });
  } catch (err) {
    bool.value = false;
  }
};
const goDetail = (e) => {
  const routeLocation = route.resolve({
    path: "/product-detail", // 在这里替换为目标路由的名称，或者直接使用 path: '/your-path'
    query: { productid: e.product_id },
  });
  // 使用 window.open 打开新窗口到目标路由
  // routeLocation.href 会给出我们基于当前路由配置解析出的完整 URL
  window.open(routeLocation.href, "_blank");
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
    cursor: pointer;
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