<template>
  <div class="user-container">
    <div class="container">
      <div class="info-box flex-align-end">
        <div class="profile">
          <img
            :src="userinfo.avatar"
            alt=""
          />
          <div  class="upload">
            <upload v-model="param.avatar" @uploadSuccess="uploadSuccess"></upload>
          </div>
        </div>
        <div class="info">
          <div class="name">{{userinfo.user_name}}</div>
          <div class="balance">
            余额：{{userinfo.money}}； <span class="cz-but">充值</span>
          </div>
        </div>
        <div
          class="edit-button"
          data-bs-toggle="modal"
          data-bs-target="#edit-user-info"
        >
          编辑
        </div>
      </div>
      <div class="tab-box">
        <div
          @click="handleTabChange(index)"
          class="tab-item"
          :class="activeTab === index ? 'tab-item-active' : ''"
          v-for="(item, index) in tabs"
          :key="index"
        >
          {{ item }}
        </div>
      </div>
      <div class="line"></div>
      <CurrentOrder v-if="activeTab === 0"></CurrentOrder>
      <HstoricalOrders v-if="activeTab === 1"></HstoricalOrders>
      <Address v-if="activeTab === 2"></Address>
    </div>
    <modal id="edit-user-info" title="编辑信息" width="600px" @ok="editUserModalOk">
      <a-form
        :model="param"
        layout="horizontal"
        name="basic"
        ref="formRef"
        :rules="rules"
        autocomplete="off"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
      >
        <a-form-item label="名称" name="user_name">
          <a-input v-model:value="param.user_name" />
        </a-form-item>

        <a-form-item label="联系方式" name="phone" >
          <a-input v-model:value="param.phone" />
        </a-form-item>
        <a-form-item label="收货地址" name="address">
          <a-input v-model:value="param.address" />
        </a-form-item>
      </a-form>
    </modal>
  </div>
</template>

<script setup>
import { ref, reactive,onMounted } from "vue";
import Address from "../components/address.vue";
import CurrentOrder from "../components/current-order.vue";
import HstoricalOrders from "../components/hstorical-orders.vue";
import modal from "../components/modal.vue";
import { httpAction, getAction } from "../api/manage.js";
import upload from "../components/upload.vue";
let userinfo = reactive({})
let param = reactive({
  user_name: "",
  phone: "",
  address: "",
  avatar:''
});

let rules = reactive({
  user_name: [
    {
      required: true,
      message: "Please input your mobile phone number!",
      trigger: "blur",
    },
  ],
  phone: [
    // {
    //   required: true,
    //   message: "Please input your mobile phone number!",
    //   trigger: "blur",
    // },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: "Invalid Chinese mainland mobile phone number!",
      trigger: ["blur", "change"],
    },
  ],
  // address: [
  //   {
  //     required: true,
  //     message: "Please input your mobile phone number!",
  //     trigger: "blur",
  //   },
  // ],
});
let tabs = reactive(["当前订单", "历史订单"]); //,'收货地址'
let activeTab = ref(0);
const handleTabChange = (index) => {
  activeTab.value = index;
};
const onFinish = (values) => {
  console.log("Success:", values);
};
const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

const getUserInfo = () => {
  getAction('User/info',{}).then((res) => {
    if(res.code === '0000'){
      for(let key in res.data){
        userinfo[key] = res.data[key]
      }
      param = Object.assign(param, userinfo)
      param.avatar = ''
    }
  })
}
const uploadSuccess = (avatar) => {
  editUserInfo()
}
const editUserModalOk = () => {
  delete param.avatar
  editUserInfo()
}
const editUserInfo = () => {
  httpAction('User/edit',param,'put').then((res) => {
    if(res.code === '0000'){
      getUserInfo()
    }
    param.avatar = ''
  })
}
onMounted(() => {
  getUserInfo()
})
</script>

<style lang="less" scoped>
.user-container {
  position: relative;
  background-color: rgba(245, 245, 245, 1);
}
.container {
  padding: 0;
  background: #fff;
  min-height: 100vh;
}
.info-box {
  position: relative;
  height: 200px;
  box-sizing: border-box;
  padding: 10px 20px;
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url("../assets/userBG.png");
  background-size: cover;
  .profile {
    width: 90px;
    height: 90px;
    position: relative;
    img {
      width: 100%;
      height: 100%;
      border-radius: 3px;
      object-fit: cover;
    }
    .upload{
      width: 90px;
      height: 90px;
      overflow: hidden;
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
    }
  }
  .info {
    margin-left: 20px;
    color: #fff;
    .name {
      padding-bottom: 5px;
      font-size: 20px;
      font-weight: bold;
    }
    .balance {
      font-size: 14px;
      .cz-but {
        color: red;
        cursor: pointer;
      }
    }
  }
  .edit-button {
    position: absolute;
    right: 15px;
    top: 15px;
    font-size: 14px;
    color: #007bff;
    cursor: pointer;
  }
}

.info-box::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-size: cover;
  opacity: 0.5;
  /* 设置透明度为 0.5 */
  z-index: -1;
  /* 确保伪元素位于内容下方 */
}
.tab-box {
  height: 60px;
  border: 1px solid #ccc;
  display: flex;
  border-radius: 0 0 5px 5px;
  overflow: hidden;
  .tab-item {
    padding: 0 20px;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    cursor: pointer;
  }
  .tab-item-active {
    border-bottom: 3px solid #007bff;
  }
}
.line {
  height: 10px;
  background-color: rgba(245, 245, 245, 1);
}
.col-form-label {
  padding: 0;
  padding-left: 10px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>