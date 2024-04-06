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
      <a-form-item label="配送员名称" name="delivery_name">
        <a-input placeholder="配送员名称" v-model:value="model.delivery_name" />
      </a-form-item>
      <a-form-item label="配送员账号" name="delivery_account">
        <a-input
          v-model:value="model.delivery_account"
          placeholder="配送员账号"
        />
      </a-form-item>
      <a-form-item label="密码" name="delivery_password">
        <a-input v-model:value="model.delivery_password" placeholder="密码" />
      </a-form-item>
      <a-form-item label="手机号" name="phone">
        <a-input v-model:value="model.phone" placeholder="手机号" />
      </a-form-item>
      <a-form-item label="冻结" name="state">
        <a-switch v-model:checked="model.state" />
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
    default: "编辑",
  },
});

const emit = defineEmits(["submitSuccess"]);
const open = ref(false);
const form = ref(null);
let model = reactive({state:false});
const httpUrl = reactive({
  add: "Delivery/add",
  edit: "Delivery/edit",
});
const rules = reactive({
//   delivery_name: [
//     {
//       required: true,
//       message: "请填写配送员名称!",
//       trigger: "blur",
//     },
//   ],
//   delivery_account: [
//     {
//       required: true,
//       message: "请填写账号!",
//       trigger: "blur",
//     },
//   ],
//   delivery_password: [
//     {
//       required: true,
//       message: "请填写密码!",
//       trigger: "blur",
//     },
//   ],
//   phone: [
//     {
//       required: true,
//       message: "Please input your mobile phone number!",
//       trigger: "blur",
//     },
//     {
//       pattern: /^1[3-9]\d{9}$/,
//       message: "请输入正确的手机号!",
//       trigger: ["blur", "change"],
//     },
//   ],
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
      httpAction(url, model, method)
        .then((result) => {
          console.log(result);
          if (result.code === "0000") {
            open.value = false;
            emit("submitSuccess");
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