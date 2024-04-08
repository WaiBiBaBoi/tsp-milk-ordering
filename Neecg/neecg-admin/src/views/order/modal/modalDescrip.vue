<template>
  <a-drawer
    width="600px"
    v-model:open="open"
    class="custom-class"
    root-class-name="root-class-name"
    :title="props.title"
    placement="right"
    @after-open-change="afterOpenChange"
  >
    <a-descriptions layout="vertical" bordered>
      <a-descriptions-item label="订单编号" :span="3">{{
        model.id
      }}</a-descriptions-item>
      <a-descriptions-item label="订单状态" :span="3">{{
        status_arr[model.order_status].text
      }}</a-descriptions-item>
      <a-descriptions-item
        v-if="model.order_status === 1"
        label="取消原因"
        :span="3"
        >{{ model.abort_reason }}</a-descriptions-item
      >
      <a-descriptions-item
        v-if="model.order_status === 9"
        label="退换申请理由"
        :span="3"
        >{{ model.return_message }}</a-descriptions-item
      >
      <a-descriptions-item
        v-if="model.order_status === 9"
        label="退换申请图片"
        :span="3"
      >
        <a-image
          :width="200"
          :src="item"
          v-for="(item, index) in images"
          :key="index"
        />
      </a-descriptions-item>
      <a-descriptions-item
        v-if="model.order_status === 9"
        label="拒绝原因"
        :span="3"
        >{{ model.reject_reason }}</a-descriptions-item
      >
      <a-descriptions-item label="购买用户" :span="3">{{
        model.user.user_name
      }}</a-descriptions-item>
      <a-descriptions-item label="产品名称" :span="3">{{
        model.product_name
      }}</a-descriptions-item>
      <a-descriptions-item label="商品名称" :span="3">{{
        model.commodity_name
      }}</a-descriptions-item>
      <a-descriptions-item label="订单金额" :span="3">{{
        model.total_price
      }}</a-descriptions-item>
      <a-descriptions-item label="购买数量" :span="3">{{
        model.quantity
      }}</a-descriptions-item>
      <a-descriptions-item v-if="model.delivery" label="配送员" :span="3">{{
        model.delivery.delivery_name
      }}</a-descriptions-item>
       <a-descriptions-item v-if="model.delivery" label="配送员联系电话" :span="3">{{
        model.delivery.phone
      }}</a-descriptions-item>
      <a-descriptions-item label="收货人" :span="3">{{
        model.receiver
      }}</a-descriptions-item>
      <a-descriptions-item label="收货手机号" :span="3">
        {{ model.phone }}
      </a-descriptions-item>
      <a-descriptions-item label="收货地址" :span="3">
        {{ model.address }}
      </a-descriptions-item>
      <a-descriptions-item label="下单时间" :span="3">
        {{ getDate(model.updatedAt) }}
      </a-descriptions-item>
    </a-descriptions>
    <template #footer>
      <a-button @click="hideDrawer">取消</a-button>
    </template>
  </a-drawer>
</template>

<script setup>
// 订单状态: 0 已下单，1 已接单，2 配送中，3 配送完成，4 确认收货，5 退换申请中，6 退换成功，7 退换失败
import { ref, reactive, defineEmits } from "vue";
import { httpAction } from "@/api/manage.js";
const props = defineProps({
  title: {
    type: String,
    default: "详情",
  },
});
let model = reactive({});
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
    text: "用户取消订单",
    value: 2,
  },
  {
    text: "已接单",
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
const emit = defineEmits(["submitSuccess"]);
const open = ref(false);
let images = reactive([])
const getDate = (isoDateString) => {
  // 创建一个新的Date对象
  const date = new Date(isoDateString);

  // 使用Intl.DateTimeFormat来格式化日期为中国的格式
  const formattedDate = new Intl.DateTimeFormat("zh-CN", {
    year: "numeric", // 数字年份
    month: "2-digit", // 两位数字月份
    day: "2-digit", // 两位数字日期
    hour: "2-digit", // 两位数字小时
    minute: "2-digit", // 两位数字分钟
    second: "2-digit", // 两位数字秒
    hour12: false, // 使用24小时制
    timeZone: "Asia/Shanghai", // 指定时区为上海
  }).format(date);
  return formattedDate;
};
const afterOpenChange = (bool) => {
  console.log("open", bool);
  if (!bool) {
    resetModel();
  }
};
const resetModel = () => {
  // for (let key in model) {
  //   model[key] = undefined;
  // }
};
const hideDrawer = () => {
  resetModel();
  open.value = false;
};
const showDrawer = (param = {}) => {
  model = Object.assign({}, param);
  if(model.return_images){
    images.splice(0,images.length)
  images.push(...model.return_images.split(','))
  }
  
  open.value = true;
};

defineExpose({
  showDrawer,
});
</script>

<style lang="less" scoped></style>