<template>
  <a-config-provider :auto-insert-space-in-button="false">
    <div>
      <div
        class="list-container info-box"
        style="border-bottom: 1px solid #000"
      >
        <a-descriptions>
          <a-descriptions-item label="配送员">{{
            deliveryInfo.delivery_name
          }}</a-descriptions-item>
          <a-descriptions-item label="总业绩">{{
            deliveryInfo.performance
          }}</a-descriptions-item>
          <a-descriptions-item label="本月业绩">{{
            deliveryInfo.monthPerformance
          }}</a-descriptions-item>
        </a-descriptions>
      </div>
      <div
        style="
          display: flex;
          justify-content: space-around;
          padding: 8px 0;
          font-size: 14px;
          margin-top: 8px;
        "
      >
        <div
          @click="chageStatus(item, index)"
          v-for="(item, index) in tabs"
          :key="item"
          :class="index === tabsActive ? 'tabsActive' : ''"
        >
          {{ item.text }}
        </div>
      </div>
      <hr />
    </div>
    <div class="list-container">
      <a-input-search
      v-model:value="param.id"
      placeholder="商品编号"
      enter-button
      @search="getListData(tabsActive)"
      style="margin-bottom: 10px;"
    />
      <a-spin :spinning="loading">
        <a-card
          hoverable
          style="width: 100%"
          v-for="item in listData"
          :key="item.id"
        >
          <template #actions>
            <span v-if="tabsActive === 0" style="color: rgb(16, 142, 233);" @click="startDelivery(item)">立即配送</span>
            <span v-if="tabsActive === 1" style="color: rgb(255, 85, 0);" @click="completeDelivery(item)">完成配送</span>
            <span v-if="tabsActive === 2" style="color: rgb(135, 208, 104);">已完成配送</span>
          </template>
          <div style="text-align: left">
            <div class="line-clamp" style="margin-bottom: 6px">
              商品单号：{{ item.id }}
            </div>
            <div style="margin-bottom: 6px">
              商品名称：{{ item.commodity_name }}
            </div>
            <hr />
            <div style="margin-bottom: 6px">配送地址：{{ item.address }}</div>
            <div style="margin-bottom: 6px">收货人：{{ item.receiver }}</div>
            <div style="margin-bottom: 6px">联系电话：{{ item.phone }}</div>
          </div>
        </a-card>
        <a-empty v-if="listData.length === 0" />
      </a-spin>
    </div>
  </a-config-provider>
</template>

<script setup>
// ... JavaScript remains the same
import { reactive, ref } from "vue";
import { httpAction, getAction } from "@/api/manage.js";
let listData = reactive([]);
let loading = ref(false);
let deliveryInfo = reactive({});
let param = {
  order_status: [3],
};
let tabs = reactive([
  {
    text: "未开始",
    order_status: [3],
  },
  {
    text: "进行中",
    order_status: [4],
  },
  {
    text: "已完成",
    order_status: [5],
  },
]);
let tabsActive = ref(0);

const chageStatus = (item, index) => {
  param.order_status.splice(0, param.order_status.length);
  param.order_status.push(...item.order_status);
  getListData(index);
};
const getDeliveryInfo = () => {
  getAction("Delivery/info").then((res) => {
    if (res.code === "0000") {
      for (let key in res.data) {
        deliveryInfo[key] = res.data[key];
      }
    }
  });
};
const getListData = (index) => {
  getAction("Delivery/delivery-list", param).then((res) => {
    if (res.code === "0000") {
      listData.splice(0, listData.length);
      listData.push(...res.data.rows);
      tabsActive.value = index;
    }
  });
};
const startDelivery = (item) => {
  httpAction('Order/startDelivery',{id:item.id},'put').then((res) => {
    if(res.code === '0000'){
      setTimeout(() => {
        getListData(tabsActive.value);
      },500)
    }
  })
}
const completeDelivery = (item) => {
  httpAction('Order/completeDelivery',{id:item.id},'put').then((res) => {
    if(res.code === '0000'){
      setTimeout(() => {
        getListData(tabsActive.value);
      },500)
    }
  })
}
getListData(tabsActive.value);
getDeliveryInfo();
</script>

<style scoped >
.list-container {
  padding: 20px;
}
.info-box {
  position: relative;
  box-sizing: border-box;
  padding: 10px 20px;
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url("../assets/userBG.png");
  background-size: cover;
  color: #fff !important;
}

/* 响应式布局 */
@media screen and (max-width: 600px) {
  .list-container {
    padding: 10px;
  }
}
.tabsActive {
  color: #1677ff;
}
</style>