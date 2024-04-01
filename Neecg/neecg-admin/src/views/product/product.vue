<template>
  <div class="neecg-box">
    <div class="neecg-query-box">
      <a-form layout="horizontal" :model="data.queryParam">
        <a-row :gutter="[16, 24]">
          <a-col class="gutter-row" :span="6">
            <a-form-item label="产品名称">
              <a-input
                style="width: 100%"
                v-model:value="data.queryParam.product_name"
                placeholder="产品名称"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="neecg-button-box">
      <a-button type="primary" @click="handle.handleAdd">新增</a-button>
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
    <!-- :row-selection="data.rowSelection" -->
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
            <a-button type="link" @click="handleCommodityAdd(record)">添加商品</a-button>
            <a-button type="link" @click="handle.handleDetails(record)">详情</a-button>
            <a-button type="link" @click="handle.handleEdit(record)"
              >编辑</a-button
            >
            <a-popconfirm
              title="确定要删除吗？"
              ok-text="是"
              cancel-text="否"
              @confirm="handle.handleDelete(record)"
            >
              <a-button type="link">删除</a-button>
            </a-popconfirm>
          </div>
        </template>
        <template #expandedRowRender="{ record }">
          <childTable :id="record.id" ref="refChildTable" @childEidt="hanleCommodityEdit"></childTable>
        </template>
        <template #expandColumnTitle>
        </template>
      </a-table>
    </div>
    <modal-form
      ref="RefForm"
      @submitSuccess="handle.submitSuccess"
    ></modal-form>
    <modal-descrip ref="RefDescrip"></modal-descrip>
    <childModalFrom ref="RefChildFrom" @childSubmitSuccess="childSubmitSuccess"></childModalFrom>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import modalForm from "./modal/modalForm.vue";
import modalDescrip from "./modal/modalDescrip.vue";
import childTable from './modal/childTable.vue'
import childModalFrom from './modal/childModalFrom.vue'
import { httpAction, getAction } from "@/api/manage.js";
import { Composable } from "@/composable/TableComposable";
const { data, handle } = Composable();
const columns = [
  {
    title: "产品名称",
    dataIndex: "product_name",
    key: "product_name",
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
const RefChildFrom = ref(null)
const refChildTable = ref(null)
const httpUrl = reactive({
  list: "Product/getProductList",
  delete: "Product/delete",
});
const handleCommodityAdd = (record) => {
    RefChildFrom.value.showDrawer({
        product_id:record.id
    })
}
const hanleCommodityEdit = (record) => {
    RefChildFrom.value.showDrawer(record)
}
const childSubmitSuccess = () => {
    refChildTable.value.getList()
}

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