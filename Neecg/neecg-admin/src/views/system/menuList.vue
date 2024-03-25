<template>
    <div class="neecg-box">
        <div class="neecg-query-box">
            <a-form layout="horizontal" :model="data.queryParam">
                <a-row :gutter="[16, 24]">
                    <a-col class="gutter-row" :span="6">
                        <a-form-item label="菜单名称">
                            <a-input style="width: 100%;" v-model:value="data.queryParam.menu_name"
                                placeholder="菜单名称" />
                        </a-form-item>
                    </a-col>
                    <a-col class="gutter-row" :span="6">
                        <a-form-item label="菜单路径">
                            <a-input style="width: 100%;" v-model:value="data.queryParam.menu_address"
                                placeholder="菜单路径" />
                        </a-form-item>
                    </a-col>
                    <a-col class="gutter-row" :span="6">
                        <a-form-item label="路由地址">
                            <a-input style="width: 100%;" v-model:value="data.queryParam.route_address"
                                placeholder="路由地址" />
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
                :pagination="false"
                @change="handle.paginationChange">
                <template v-slot:operation="{ record }">
                    <div class="operation">
                        <a-button type="link" @click="handle.handleEdit(record)">编辑</a-button>
                        <a-button type="link" @click="handle.handleAddChild(record)">添加下级</a-button>
                        <a-popconfirm title="确定要删除吗？" ok-text="是" cancel-text="否" @confirm="handle.handleDelete(record)">
                            <a-button type="link">删除</a-button>
                        </a-popconfirm>
                    </div>
                </template>
            </a-table>
        </div>
        <menu-modal ref="modalForm" @submitSuccess="handle.submitSuccess"></menu-modal>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import menuModal from './model/menuModal.vue'
import { httpAction,getAction } from '@/api/manage.js'
import {Composable} from '@/composable/TableComposable'
const {data,handle} = Composable()
const columns = [
    {
        title: '菜单名称',
        dataIndex: 'menu_name',
        key: 'menu_name',
    },
    {
        title: '菜单路径',
        dataIndex: 'menu_address',
        key: 'menu_address',
    },
    {
        title: '路由地址',
        dataIndex: 'route_address',
        key: 'route_address',
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
const httpUrl = reactive({
    list:'SystemMenu/list',
    delete:'SystemMenu/delete'
})
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