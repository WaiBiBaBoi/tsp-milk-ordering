import { ref, reactive, onMounted } from 'vue';
import { httpAction, getAction } from '@/api/manage.js'
import { proxyToObject } from '@/utils/proxyToObject'
import { message } from 'ant-design-vue';




export function Composable() {

    const tableData = ref([]);

    const modalForm = ref(null)
    const modalDescrip = ref(null)

    let queryParam = reactive({})

    let httpUrl = reactive()

    const pagination = reactive({
        current: 1, // 当前页数
        pageSize: 10, // 每页条数
        total: 2, // 数据总数，通常需要从服务器端获取
        showSizeChanger: true, // 是否显示 pageSize 选择器
        showQuickJumper: true, // 是否可以快速跳转至某页
        pageSizeOptions: ['5', '10', '30', '40'], // 指定每页可以显示多少条
        showTotal: (total, range) => `共 ${total} 条`, // 用于显示数据总量和当前数据顺序
    })

    const rowSelection = ref({
        checkStrictly: false,
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        onSelect: (record, selected, selectedRows) => {
            console.log(record, selected, selectedRows);
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
            console.log(selected, selectedRows, changeRows);
        },
    })

    const handleAdd = (record = {}) => {
        modalForm.value.showDrawer(record)
    }

    const handleAddChild = (record) => {
        modalForm.value.showDrawer({
            parent_id: record.id
        })
    }

    const handleEdit = (record) => {
        modalForm.value.showDrawer(record)
    }

    const handleDetails = (record) => {
        modalDescrip.value.showDrawer(record)
    }

    const handleDelete = (record) => {
        console.log(httpUrl.delete);
        httpAction(httpUrl.delete, {
            id: record.id
        }, 'delete').then(result => {
            if (result) {
                handleList()
                message.success('删除成功')
            }
        }).catch(err => {
            console.log(err);
        })
    }

    const submitSuccess = () => {
        handleList()
    }


    const handleList = () => {
        getAction(httpUrl.list, proxyToObject(queryParam), 'get').then(result => {
            if (result) {
                tableData.value.splice(0,tableData.value.length)
                tableData.value.push(...result.data.rows)
                pagination.total = result.data.count
            }
        }).catch(err => {
            console.log(err);
        })
    }
    const reset = () => {
        for (const key in queryParam) {
            queryParam[key] = undefined; // 或者其他初始值
        }
        handleList()
    }

    const paginationChange = (config) => {
        console.log(config);
        for (const key in config) {
            pagination[key] = config[key]; // 或者其他初始值
        }
        handleList()
    }

    const init = (config) => {
        modalForm.value = config.modalForm?.value
        modalDescrip.value = config.modalDescrip?.value
        httpUrl = config.httpUrl
    }
    let data = reactive({
        tableData,
        modalForm,
        queryParam,
        pagination,
        rowSelection
    })

    const handle = {
        handleAdd,
        handleAddChild,
        handleEdit,
        handleDetails,
        handleDelete,
        submitSuccess,
        handleList,
        reset,
        init,
        paginationChange
    }

    return { data, handle };
}

