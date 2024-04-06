<template>
    <div class="neecg-box">
        <div class="neecg-query-box">
            <a-form layout="horizontal" :model="data.queryParam">
                <a-row :gutter="[16, 24]">
                    <a-col class="gutter-row" :span="6">
                        <a-form-item label="用户账号">
                            <a-input style="width: 100%;" v-model:value="data.queryParam.user_account"
                                placeholder="用户账号" />
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
        </div>
        <div class="neecg-button-box">
            <a-button type="primary" @click="handle.handleAdd">新增</a-button>
            <a-button type="primary" style="margin-left: 8px;" @click="handle.handleList">查询</a-button>
            <a-button type="primary" style="margin-left: 8px;" @click="handle.reset">重置</a-button>

        </div>
        <div class="neecg-table-box">
            <a-table :rowKey="record => record.id" 
                bordered 
                :columns="columns" 
                :data-source="data.tableData" 
                :pagination="data.pagination"
                @change="handle.paginationChange">
                <template v-slot:operation="{ record }">
                    <div class="operation">
                        <a-button type="link" @click="handle.handleDetails(record)">详情</a-button>
                        <a-button type="link" @click="handle.handleEdit(record)">编辑</a-button>
                        <a-popconfirm title="确定要删除吗？" ok-text="是" cancel-text="否" @confirm="handle.handleDelete(record)">
                            <a-button type="link">删除</a-button>
                        </a-popconfirm>
                    </div>
                </template>
                <template v-slot:state="{ record }">
                    <div>
                        <a-tag color="success" v-if="record.is_using">启用</a-tag>
                        <a-tag color="error" v-else>关闭</a-tag>
                    </div>
                </template>
            </a-table>
        </div>
        <modal-form ref="RefForm" @submitSuccess="handle.submitSuccess"></modal-form>
        <modal-descrip ref="RefDescrip"></modal-descrip>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import modalForm from './modal/modalForm.vue'
import modalDescrip from './modal/modalDescrip.vue'

import { httpAction,getAction } from '@/api/manage.js'
import {Composable} from '@/composable/TableComposable'
const {data,handle} = Composable()
const columns = [
    {
        title: '配送员名称',
        dataIndex: 'delivery_name',
        key: 'delivery_name',
    },
    {
        title: '账号',
        dataIndex: 'delivery_account',
        key: 'delivery_account',
    },
    {
        title: '业绩',
        dataIndex: 'performance',
        key: 'performance',
    },
    {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: '147px',
        slots: { customRender: 'operation' }, // 这里设置slots属性
    },
];
const RefForm = ref(null)
const RefDescrip = ref(null)

const httpUrl = reactive({
    list:'Delivery/list',
    delete:'Delivery/delete'
})

onMounted(() => {
    console.log('onMounted');
    handle.init({
        modalForm:RefForm,
        modalDescrip:RefDescrip,
        httpUrl
    })
    handle.handleList()
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