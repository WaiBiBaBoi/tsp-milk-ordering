<template>
  <div class="current-order-container">
    <div
      class="add-address-button"
      data-toggle="modal"
      data-target="#add-address-model"
    >
      添加收货地址
    </div>
    <hr />
    <div class="list">
      <div class="item" v-for="item in 5" :key="item">
        <div class="flex-between">
          <div class="order-info">
            <div class="info flex-align-between">
              <div>
                <div class="order-name">联系人：虎哥</div>
                <div class="order-phone">联系方式：136xxxxxx08</div>
                <div class="address-text">
                  收货地址：广西壮族自治区南宁市那洪街道汇东星世界1170菜鸟驿站
                </div>
              </div>
            </div>
          </div>
          <div class="operate-buttom">
            <div style="display: flex">
              <div class="edit-address-button">编辑</div>
              <div class="cancel-button">删除</div>
            </div>
          </div>
        </div>
        <hr />
      </div>
    </div>
    <modal id="add-address-model" title="添加地址">
      <form>
        <div class="form-group">
          <label for="exampleInputEmail1">Email address</label>
          <input
            type="email"
            class="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
          />
          <small id="emailHelp" class="form-text text-muted"
            >We'll never share your email with anyone else.</small
          >
        </div>
        <div class="form-group">
          <label for="exampleInputPassword1">Password</label>
          <input
            type="password"
            class="form-control"
            id="exampleInputPassword1"
          />
        </div>
      </form>
    </modal>
  </div>
</template>
  
  <script setup>
import modal from "../components/modal.vue";
</script>
  
  <style lang="less" scoped>
.current-order-container {
  padding: 20px;
}
.list {
  .item {
    .order-info {
      display: flex;
      .info {
        margin-left: 15px;
        .address-text {
          font-size: 14px;
        }
        .order-phone {
          font-size: 14px;
          margin-bottom: 6px;
        }
        .order-name {
          font-size: 14px;
          margin-bottom: 6px;
        }
      }
    }
    .operate-buttom {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      font-size: 14px;
      .cancel-button {
        color: #f33f3f;
        cursor: pointer;
      }
      .edit-address-button {
        color: #007bff;
        cursor: pointer;
        margin-right: 10px;
      }
    }
  }
}
.add-address-button {
  text-align: right;
  color: #007bff;
  font-size: 14px;
  cursor: pointer;
}
</style>