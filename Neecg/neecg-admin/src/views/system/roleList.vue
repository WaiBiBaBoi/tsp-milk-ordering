<template>
    <div class="neecg-box">
        <div class="neecg-query-box">
            <a-form layout="horizontal" :model="data.queryParam">
                <a-row :gutter="[16, 24]">
                    <a-col class="gutter-row" :span="6">
                        <a-form-item label="角色名称">
                            <a-input style="width: 100%;" v-model:value="data.queryParam.role_name"
                                placeholder="角色名称" />
                        </a-form-item>
                    </a-col>
                    <a-col class="gutter-row" :span="6">
                        <a-form-item label="备注">
                            <a-input style="width: 100%;" v-model:value="data.queryParam.remark"
                                placeholder="备注" />
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
                        <a-button type="link" @click="handleAuthorization(record)">授权</a-button>
                        <a-popconfirm title="确定要删除吗？" ok-text="是" cancel-text="否" @confirm="handle.handleDelete(record)">
                            <a-button type="link">删除</a-button>
                        </a-popconfirm>
                    </div>
                </template>
            </a-table>
        </div>
        <role-modal ref="modalForm" @submitSuccess="handle.submitSuccess"></role-modal>
        <route-authorization-modal ref="modalRoute"  @submitSuccess="handle.submitSuccess"></route-authorization-modal>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import roleModal from './model/roleModal.vue'
import routeAuthorizationModal from './model/routeAuthorizationModal.vue'
import { httpAction,getAction } from '@/api/manage.js'
import {Composable} from '@/composable/TableComposable'
const {data,handle} = Composable()
const columns = [
    {
        title: '角色名称',
        dataIndex: 'role_name',
        key: 'role_name',
    },
    {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
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
const modalRoute = ref(null)
const httpUrl = reactive({
    list:'SystemRole/list',
    delete:'SystemRole/delete'
})
const handleAuthorization = (record) => {
    modalRoute.value.showDrawer(record)
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