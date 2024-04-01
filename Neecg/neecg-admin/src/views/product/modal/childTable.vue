<template>
  <div>
    <a-table
      :columns="columns"
      :data-source="data"
      :pagination="false"
      bordered
    >
        <template v-slot:operation="{ record }">
          <div class="operation">
            <a-button type="link" @click="handleDetails(record)">详情</a-button>
            <a-button type="link" @click="handleEdit(record)">编辑</a-button>
            <a-popconfirm
              title="确定要删除吗？"
              ok-text="是"
              cancel-text="否"
              @confirm="handleDelete(record)"
            >
              <a-button type="link">删除</a-button>
            </a-popconfirm>
          </div>
        </template>
    </a-table>
    <childModalDescrip ref="RefChildDescrip"></childModalDescrip>
  </div>
</template>
  <script setup>
import { ref,reactive, onMounted } from "vue";
import { httpAction, getAction } from "@/api/manage.js";
import { message } from 'ant-design-vue';
import childModalDescrip from './childModalDescrip.vue'
const columns = [
  {
    title: "商品名称",
    dataIndex: "commodity_name",
    key: "commodity_name",
  },
  {
    title: "商品单价",
    dataIndex: "price",
    key: "price",
  },
  {
    title: "库存",
    key: "reserve",
    dataIndex: "reserve",
  },
  {
    title: "操作",
    dataIndex: "operation",
    key: "operation",
    width: "247px",
    slots: { customRender: "operation" }, // 这里设置slots属性
  },
];
const props = defineProps({
  id: String,
});
const emit = defineEmits(['childEidt'])
let data = reactive([]);
const RefChildDescrip = ref(null)
const getList = () => {
  getAction("Commodity/listAll", {
    product_id:props.id
  }).then((res) => {
    if (res.code === "0000") {
        data.splice(0, data.length, ...res.data);
    }
  });
};
const handleEdit = (record) => {
    emit('childEidt',record)
}
const handleDetails = (record) => {
    RefChildDescrip.value.showDrawer(record)
}
const handleDelete = (record) => {
  httpAction(
    "Commodity/delete",
    {
      id: record.id,
    },
    "delete"
  )
    .then((result) => {
      if (result) {
        getList();
        message.success('删除成功')
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
onMounted(() => {
    getList()
})
defineExpose({
  getList,
});
</script>