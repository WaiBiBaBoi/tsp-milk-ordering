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
    <a-form
      ref="form"
      :model="model"
      name="basic"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 20 }"
      autocomplete="off"
      :rules="rules"
      labelAlign="right"
    >
      <a-form-item label="选择配送员" name="delivery_id">
        <a-select
          ref="select"
          v-model:value="model.delivery_id"
          style="width: 100%"
          placeholder="选择配送员"
        >
          <a-select-option
            :value="item.id"
            v-for="(item, index) in deliveryList"
            :key="index"
            >{{ item.delivery_name }}</a-select-option
          >
        </a-select>
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button type="primary" style="margin-right: 8px" @click="submit"
        >确定</a-button
      >
      <a-button @click="hideDrawer">取消</a-button>
    </template>
  </a-drawer>
</template>

<script setup>
import { ref, reactive, defineEmits } from "vue";
import { httpAction,getAction } from "@/api/manage.js";
const props = defineProps({
  title: {
    type: String,
    default: "确认接单",
  },
});

const emit = defineEmits(["submitSuccess"]);
const open = ref(false);
const form = ref(null);
let model = reactive({});
const httpUrl = reactive({
  add: "Order/add",
  edit: "Order/confirmOrderAcceptance",
});
const rules = reactive({
    delivery_id: [{ required: true, message: "请选择配送员" }],
  // image: [{ required: true, message: '请上传图片' }],
});
let deliveryList = reactive([])
const afterOpenChange = (bool) => {
  console.log("open", bool);
  if (!bool) {
    resetModel();
  }
};
const resetModel = () => {
  for (let key in model) {
    model[key] = undefined;
  }
};
const hideDrawer = () => {
  resetModel();
  open.value = false;
};

const getDeliveryList = () => {
  getAction('Delivery/selete-list',{
      state:0
    }).then((res) => {
      deliveryList.splice(0,deliveryList.length)
      deliveryList.push(...res.data)
    })
}

const showDrawer = (param = {}) => {
  console.log(param);
  getDeliveryList()
  if (param.id) {
    edit(param);
  } else {
    add(param);
  }
};
const add = (param) => {
  model = Object.assign({}, param);
  open.value = true;
};
const edit = (param) => {
  model = Object.assign(model, param);
  console.log(model);
  open.value = true;
};

const submit = () => {
  form.value
    .validate()
    .then(() => {
      let url;
      let method;
      if (model.id) {
        url = httpUrl.edit;
        method = "put";
      } else {
        url = httpUrl.add;
        method = "post";
      }
      httpAction(
        url,
        { delivery_id: model.delivery_id, id: model.id },
        method
      )
        .then((result) => {
          if (result.code === "0000") {
            open.value = false;
            setTimeout(() => {
              emit("submitSuccess");
            }, 1000);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch(() => {});
};

defineExpose({
  showDrawer,
});
</script>

<style lang="less" scoped></style>