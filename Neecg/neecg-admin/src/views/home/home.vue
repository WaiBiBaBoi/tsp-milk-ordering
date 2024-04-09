<template>
  <div>
    <a-row :gutter="[16, 24]">
      <a-col class="gutter-row" :span="6">
        <a-card title="总销售额">
          <template #extra><span>￥</span></template>
          <div class="card-content">
            <div class="number">{{ cardData.totalSales }}</div>
          </div>
        </a-card>
      </a-col>
      <a-col class="gutter-row" :span="6">
        <a-card title="今日销售额">
          <template #extra><span>￥</span></template>
          <div class="card-content">
            <div class="number">{{ cardData.dailySales }}</div>
          </div>
        </a-card>
      </a-col>
      <a-col class="gutter-row" :span="6">
        <a-card title="总订单量">
          <template #extra><span>单</span></template>
          <div class="card-content">
            <div class="number">{{ cardData.totalOrderQuantity }}</div>
          </div>
        </a-card>
      </a-col>
      <a-col class="gutter-row" :span="6">
        <a-card title="成功订单量">
          <template #extra><span>单</span></template>
          <div class="card-content">
            <div class="number">{{ cardData.totalSuccessfulOrders }}</div>
          </div>
        </a-card>
      </a-col>
    </a-row>
    <div style="height: 30px"></div>
    <hr />
    <div style="height: 30px"></div>
    <a-row :gutter="[16, 24]">
      <a-col class="gutter-row" :span="16">
        <a-card>
          <a-tabs v-model:activeKey="activeKey" @change="getEchartsData">
            <a-tab-pane key="1" tab="7日内销售额趋势">
              <div style="height: 350px" id="echarts-1"></div>
            </a-tab-pane>
            <a-tab-pane key="2" tab="7日内销售订单趋势">
              <div style="height: 350px" id="echarts-2"></div>
            </a-tab-pane>
            <a-tab-pane key="3" tab="7日内销售产品趋势" force-render>
              <div style="height: 350px" id="echarts-3"></div>
            </a-tab-pane>
          </a-tabs>
        </a-card>
      </a-col>
      <a-col class="gutter-row" :span="8">
        <a-card title="热销产品" style="height: 460px">
          <div
            class="Popular-item"
            v-for="(item, index) in Popular.xAxisData"
            :key="index"
          >
          <div class="name">
                Top-{{index +1}} 商品：{{
                  item
                }}
              </div>
              <div class="number">销量：{{ Popular.seriesData[index] }}</div>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { httpAction, getAction } from "@/api/manage.js";
import * as echarts from "echarts";
const activeKey = ref("1");
let cardData = reactive({});
let Popular = reactive({});
const totalSales = () => {
  getAction("SystemHome/totalSales", {}).then((res) => {
    if (res.code === "0000") {
      cardData.totalSales = res.totalSales;
    }
  });
};
const dailySales = () => {
  getAction("SystemHome/dailySales", {}).then((res) => {
    if (res.code === "0000") {
      cardData.dailySales = res.dailySales;
    }
  });
};
const totalOrderQuantity = () => {
  getAction("SystemHome/totalOrderQuantity", {}).then((res) => {
    if (res.code === "0000") {
      cardData.totalOrderQuantity = res.totalOrderQuantity;
    }
  });
};
const totalSuccessfulOrders = () => {
  getAction("SystemHome/totalSuccessfulOrders", {}).then((res) => {
    if (res.code === "0000") {
      cardData.totalSuccessfulOrders = res.totalSuccessfulOrders;
    }
  });
};
const createEcharts = (id, xArr, yArr) => {
  var chartDom = document.getElementById(id);
  var myChart = echarts.init(chartDom);
  var option;

  option = {
    xAxis: {
      type: "category",
      data: [...xArr],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: [...yArr],
        type: "bar",
      },
    ],
  };
  option && myChart.setOption(option);
};
const weeklySales = () => {
  getAction("SystemHome/weeklySales", {}).then((res) => {
    if (res.code === "0000") {
      createEcharts("echarts-1", res.data.xAxisData, res.data.seriesData);
    }
  });
};
const calculateWeeklySales = () => {
  getAction("SystemHome/calculateWeeklySales", {}).then((res) => {
    if (res.code === "0000") {
      createEcharts("echarts-2", res.data.xAxisData, res.data.seriesData);
    }
  });
};
const weeklyMerchandiseSales = () => {
  getAction("SystemHome/weeklyMerchandiseSales", {}).then((res) => {
    if (res.code === "0000") {
      createEcharts("echarts-3", res.data.xAxisData, res.data.seriesData);
    }
  });
};
const getEchartsData = (e) => {
  console.log(activeKey.value);
  if (activeKey.value === "1") {
    weeklySales();
  }
  if (activeKey.value === "2") {
    calculateWeeklySales();
  }
  if (activeKey.value === "3") {
    weeklyMerchandiseSales();
  }
};
const allProductSalesTrends = () => {
  getAction("SystemHome/allProductSalesTrends", {}).then((res) => {
    if (res.code === "0000") {
      for (let key in res.data) {
        Popular[key] = res.data[key];
      }
    }
  });
};
onMounted(() => {
  totalSales();
  dailySales();
  totalOrderQuantity();
  totalSuccessfulOrders();
  weeklySales();
  allProductSalesTrends();
});
</script>

<style lang="less" scoped>
.card-content {
  display: flex;
  .number {
    font-size: 24px;
    font-weight: bold;
    color: rgba(135, 208, 104, 1);
  }
}
.Popular-item {
  display: flex;
  justify-content: space-between;
  padding: 8px;
  border-bottom: 1px solid #CCC;
  .name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .number{
    width: 180px;
    text-align: right;
  }
}
</style>