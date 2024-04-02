<template>
  <a-drawer
    width="600px"
    v-model:open="open"
    class="custom-class"
    root-class-name="root-class-name"
    title="Basic Drawer"
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
      <a-form-item label="用户名称" name="user_name">
        <a-input placeholder="用户名称" v-model:value="model.user_name" />
      </a-form-item>
      <a-form-item label="用户账号" name="user_account">
        <a-input placeholder="用户账号" v-model:value="model.user_account" />
      </a-form-item>
      <a-form-item label="用户密码" name="user_password">
        <a-input placeholder="用户密码" v-model:value="model.user_password" />
      </a-form-item>
      <a-form-item label="用户角色" name="role_id">
        <n-select
          v-model="model.role_id"
          label="role_name"
          placeholder="用户角色"
          dict="system_roles,role_name,id"
        ></n-select>
      </a-form-item>
      <a-form-item label="用户部门" name="department_id">
        <!-- <a-input placeholder="用户角色" v-model:value="model.user_role" /> -->
        <n-select
          v-model="model.department_id"
          label="department_name"
          placeholder="用户部门"
          dict="system_department,department_name,id"
        ></n-select>
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
const emit = defineEmits(["submitSuccess"]);
const open = ref(false);
const form = ref(null);
let model = reactive({});
const httpUrl = reactive({
  add: "SystmeUser/add",
  edit: "SystmeUser/edit",
});
const rules = reactive({
  user_name: [{ required: true, message: "请填写用户名称" }],
  user_account: [{ required: true, message: "请填写用户账号" }],
  user_password: [{ required: true, message: "请填写用户密码" }],
  role_id: [{ required: true, message: "请选择用户角色" }],
  department_id: [{ required: true, message: "请选择用户部门" }],
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
  model = Object.assign({}, param);
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