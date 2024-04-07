<template>
  <a-config-provider :auto-insert-space-in-button="false">
    <div class="list-container info-box" style="border-bottom: 1px solid #000">
      <a-descriptions>
        <a-descriptions-item label="配送员" >{{deliveryInfo.delivery_name}}</a-descriptions-item>
      <a-descriptions-item label="总业绩" >{{deliveryInfo.performance}}</a-descriptions-item>
      <a-descriptions-item label="本月业绩" >{{deliveryInfo.monthPerformance}}</a-descriptions-item>
    </a-descriptions>
    </div>
    <div class="list-container">
      <a-spin :spinning="loading">
        <a-list item-layout="horizontal" :dataSource="listData" bordered>
          <a-list-item v-for="item in listData" :key="item.id">
            <a-list-item-meta
              :title="item.title"
              :description="item.description"
            />
          </a-list-item>
        </a-list>
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
let deliveryInfo = reactive({})
const getDeliveryInfo = () => {
  getAction("Delivery/info").then((res) => {
    if(res.code === '0000'){
      for(let key in res.data){
        deliveryInfo[key] = res.data[key]
      }
    }
  });
};
getDeliveryInfo();
</script>

<style scoped >
.list-container {
  padding: 20px;
}
.info-box{
  position: relative;
  box-sizing: border-box;
  padding: 10px 20px;
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url("../assets/userBG.png");
  background-size: cover;
  color: #FFF !important;
}

/* 响应式布局 */
@media screen and (max-width: 600px) {
  .list-container {
    padding: 10px;
  }
}
</style>