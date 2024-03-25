<template>
  <a-drawer
    width="50%"
    v-model:open="open"
    class="custom-class"
    root-class-name="root-class-name"
    title="Basic Drawer"
    placement="right"
    @after-open-change="afterOpenChange"
  >
    <div class="neecg-box">
      <div class="neecg-query-box">
        <a-form layout="horizontal" :model="data.queryParam">
          <a-row :gutter="[16, 24]">
            <a-col class="gutter-row" :span="8">
              <a-form-item label="键名">
                <a-input
                  style="width: 100%"
                  v-model:value="data.queryParam.dict_key_name"
                  placeholder="键名"
                />
              </a-form-item>
            </a-col>
            <a-col class="gutter-row" :span="8">
              <a-form-item label="键值">
                <a-input
                  style="width: 100%"
                  v-model:value="data.queryParam.dict_key_value"
                  placeholder="键值"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <div class="neecg-button-box">
        <a-button
          type="primary"
          @click="
            handle.handleAdd({
              dict_code: record.dict_code,
            })
          "
          >新增</a-button
        >
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
          :row-selection="data.rowSelection"
          :pagination="data.pagination"
          @change="handle.paginationChange"
        >
          <template v-slot:operation="{ record }">
            <div class="operation">
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
        </a-table>
      </div>
      <dict-config-modal
        ref="modalForm"
        @submitSuccess="handle.submitSuccess"
      ></dict-config-modal>
    </div>
  </a-drawer>
</template>

<script setup>
import { ref, defineExpose, reactive, onMounted, nextTick } from "vue";
import dictConfigModal from "./dictConfigModal.vue";
import { Composable } from "@/composable/TableComposable";
const { data, handle } = Composable();
const columns = [
  {
    title: "键名",
    dataIndex: "dict_key_name",
    key: "dict_key_name",
  },
  {
    title: "键值",
    dataIndex: "dict_key_value",
    key: "dict_key_value",
  },
  {
    title: "操作",
    dataIndex: "operation",
    key: "operation",
    width: "147px",
    slots: { customRender: "operation" }, // 这里设置slots属性
  },
];
const modalForm = ref(null);
let record = reactive({});
const httpUrl = reactive({
  list: "SystemDataDictConfig/list",
  delete: "SystemDataDictConfig/delete",
});

const open = ref(false);
const afterOpenChange = (bool) => {
  console.log("open", bool);

  nextTick(() => {
    if (bool) {
      handle.init({
        modalForm,
        httpUrl,
      });
      handle.handleList();
    }
  });
};
const showDrawer = (e) => {
  record = e;
  console.log(record.dict_code);
  open.value = true;
  console.log("onMounted");
};

onMounted(() => {});

defineExpose({
  showDrawer,
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