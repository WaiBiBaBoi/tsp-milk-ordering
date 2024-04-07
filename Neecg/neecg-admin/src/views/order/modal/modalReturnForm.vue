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
      <a-form-item label="是否同意" name="order_status">
        <a-radio-group v-model:value="model.status">
          <a-radio :value="8">同意</a-radio>
          <a-radio :value="9">拒绝</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="拒绝原因" name="reject_reason" v-if="model.status === 9">
        <a-input placeholder="拒绝原因" v-model:value="model.reject_reason" />
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
import { httpAction } from "@/api/manage.js";
const props = defineProps({
  title: {
    type: String,
    default: "退换审核",
  },
});

const emit = defineEmits(["submitSuccess"]);
const open = ref(false);
const form = ref(null);
let model = reactive({status:8});
const httpUrl = reactive({
  add: "Order/add",
  edit: "Order/returnReview",
});
const rules = reactive({
    reject_reason: [{ required: true, message: "请填写取消原" }],
  // image: [{ required: true, message: '请上传图片' }],
});
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
const showDrawer = (param = {}) => {
  console.log(param);
  if (param.id) {
    edit(param);
  } else {
    add(param);
  }
};
const add = (param) => {
  model = Object.assign(model, param);
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
        { reject_reason: model.reject_reason, id: model.id,status:model.status },
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