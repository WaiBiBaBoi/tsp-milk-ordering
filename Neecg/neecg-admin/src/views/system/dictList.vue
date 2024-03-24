<template>
    <div class="neecg-box">
        <div class="neecg-query-box">
            <a-form layout="horizontal" :model="data.queryParam">
                <a-row :gutter="[16, 24]">
                    <a-col class="gutter-row" :span="6">
                        <a-form-item label="字典名称">
                            <a-input style="width: 100%;" v-model:value="data.queryParam.dict_name"
                                placeholder="字典名称" />
                        </a-form-item>
                    </a-col>
                    <a-col class="gutter-row" :span="6">
                        <a-form-item label="字典编号">
                            <a-input style="width: 100%;" v-model:value="data.queryParam.dict_code"
                                placeholder="字典编号" />
                        </a-form-item>
                    </a-col>
                    <a-col class="gutter-row" :span="6">
                        <a-form-item label="字典描述">
                            <a-input style="width: 100%;" v-model:value="data.queryParam.dict_describe"
                                placeholder="字典描述" />
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
                :row-selection="data.rowSelection" 
                :pagination="data.pagination"
                @change="handle.paginationChange">
                <template v-slot:operation="{ record }">
                    <div class="operation">
                        <a-button type="link" @click="handle.handleEdit(record)">编辑</a-button>
                        <a-button type="link" @click="handleDictCinfig(record)">字典配置</a-button>
                        <a-popconfirm title="确定要删除吗？" ok-text="是" cancel-text="否" @confirm="handle.handleDelete(record)">
                            <a-button type="link">删除</a-button>
                        </a-popconfirm>
                    </div>
                </template>
            </a-table>
        </div>
        <dict-modal ref="modalForm" @submitSuccess="handle.submitSuccess"></dict-modal>
        <dict-config-list ref="configList"></dict-config-list>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import dictModal from './model/dictModal.vue'
import dictConfigList from './model/dictConfigList.vue'

import { httpAction,getAction } from '@/api/manage.js'
import {Composable} from '@/composable/TableComposable'
const {data,handle} = Composable()
const columns = [
    {
        title: '字典名称',
        dataIndex: 'dict_name',
        key: 'role_name',
    },
    {
        title: '字典编号',
        dataIndex: 'dict_code',
        key: 'dict_code',
    },
    {
        title: '字典描述',
        dataIndex: 'dict_describe',
        key: 'dict_describe',
    },
    {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: '147px',
        slots: { customRender: 'operation' }, // 这里设置slots属性
    },
];
const modalForm = ref(null)
const configList = ref(null)
const httpUrl = reactive({
    list:'SystemDataDict/list',
    delete:'SystemDataDict/delete'
})
const handleDictCinfig = (record) => {
    configList.value.showDrawer(record)
}
onMounted(() => {
    console.log('onMounted');
    handle.init({
        modalForm,
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