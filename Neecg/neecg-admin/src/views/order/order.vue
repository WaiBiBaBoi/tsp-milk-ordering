<template>
  <div class="neecg-box">
    <div class="neecg-query-box">
      <a-form layout="horizontal" :model="data.queryParam">
        <a-row :gutter="[16, 24]">
          <a-col class="gutter-row" :span="6">
            <a-form-item label="订单编号">
              <a-input
                style="width: 100%"
                v-model:value="data.queryParam.id"
                placeholder="订单编号"
              />
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="6">
            <a-form-item label="订单状态">
              <a-select
                ref="select"
                v-model:value="data.queryParam.order_status"
                style="width: 100%"
                placeholder="订单状态"
              >
                <a-select-option
                  :value="item.value"
                  v-for="(item, index) in status_arr"
                  :key="index"
                  >{{ item.text }}</a-select-option
                >
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="neecg-button-box">
      <!-- <a-button type="primary" @click="handle.handleAdd">新增</a-button> -->
      <a-button
        type="primary"
        style="margin-left: 8px"
        @click="handle.handleList"
        >查询</a-button
      >
      <a-button type="primary" style="margin-left: 8px" @click="handle.reset"
        >重置</a-button
      >
    </div>
    <div class="neecg-table-box">
      <a-table
        :rowKey="(record) => record.id"
        bordered
        :columns="columns"
        :data-source="data.tableData"
        :pagination="data.pagination"
        @change="handle.paginationChange"
      >
        <template v-slot:operation="{ record }">
          <div class="operation">
            <a-button type="link" @click="handle.handleDetails(record)"
              >详情</a-button
            >
            <a-button type="link" @click="confirmOrder(record)" v-if="record.order_status === 0"
              >确认接单</a-button
            >
            <a-button type="link" @click="cancelsOrder(record)"  v-if="record.order_status === 0"
              >取消订单</a-button
            >
            <a-button type="link" @click="returnReview(record)" v-if="record.order_status === 7"
              >退换审核</a-button
            >
            <!-- <a-button type="link" @click="handle.handleEdit(record)"
              >编辑</a-button
            > -->
            <!-- <a-popconfirm title="确定要删除吗？" ok-text="是" cancel-text="否" @confirm="handle.handleDelete(record)">
                            <a-button type="link">删除</a-button>
                        </a-popconfirm> -->
          </div>
        </template>
        <template v-slot:order_status="{ record }">
          <div>
            {{ status_arr[record.order_status].text }}
          </div>
        </template>
        <template v-slot:commodity_name="{ record }">
          <div>
            {{ record.commodity_name }}
          </div>
        </template>
      </a-table>
    </div>
    <modal-form
      ref="RefForm"
      @submitSuccess="handle.submitSuccess"
    ></modal-form>
    <modal-cancel-form
      ref="RefCancelForm"
      @submitSuccess="handle.submitSuccess"
    ></modal-cancel-form>
    <modal-descrip ref="RefDescrip"></modal-descrip>
    <modal-confirm-from
      ref="RefConfirmFrom"
      @submitSuccess="handle.submitSuccess"
    ></modal-confirm-from>
    <modal-return-form
      ref="RefReturnForm"
      @submitSuccess="handle.submitSuccess"
    ></modal-return-form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import modalForm from "./modal/modalForm.vue";
import modalDescrip from "./modal/modalDescrip.vue";
import modalCancelForm from "./modal/modalCancelForm.vue";
import modalConfirmFrom from "./modal/modalConfirmFrom.vue";
import modalReturnForm from "./modal/modalReturnForm.vue";

import { httpAction, getAction } from "@/api/manage.js";
import { Composable } from "@/composable/TableComposable";
const { data, handle } = Composable();
const columns = [
  {
    title: "订单编号",
    dataIndex: "id",
    key: "id",
    width: "350px",
  },
  {
    title: "商品名称",
    dataIndex: "commodity_name",
    key: "commodity_name",
    slots: { customRender: "commodity_name" }, // 这里设置slots属性
  },
  {
    title: "订单金额",
    dataIndex: "total_price",
    key: "total_price",
    width: "100px",
  },
  {
    title: "订单状态",
    dataIndex: "order_status",
    key: "order_status",
    width: "150px",
    slots: { customRender: "order_status" }, // 这里设置slots属性
  },
  {
    title: "收货手机号",
    dataIndex: "phone",
    key: "phone",
    width: "180px",
  },
  {
    title: "收货地址",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "操作",
    dataIndex: "operation",
    key: "operation",
    width: "147px",
    slots: { customRender: "operation" }, // 这里设置slots属性
  },
];
const RefForm = ref(null);
const RefDescrip = ref(null);
const RefCancelForm = ref(null);
const RefConfirmFrom = ref(null);
const RefReturnForm = ref(null);
const httpUrl = reactive({
  list: "Order/orderList",
  delete: "Order/delete",
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
const cancelsOrder = (record) => {
  RefCancelForm.value.showDrawer(record);
};
const confirmOrder = (record) => {
  RefConfirmFrom.value.showDrawer(record);
};
const returnReview = (record) => {
  RefReturnForm.value.showDrawer(record);
};
onMounted(() => {
  console.log("onMounted");
  handle.init({
    modalForm: RefForm,
    modalDescrip: RefDescrip,
    httpUrl,
  });
  handle.handleList();
});
</script>

<style lang="less" scoped>
.neecg-table-box {
  padding-top: 10px;

  .operation {
    display: flex;
  }
}
</style>