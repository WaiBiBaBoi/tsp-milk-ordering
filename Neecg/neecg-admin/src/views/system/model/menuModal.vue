<template>
    <a-drawer width="600px" v-model:open="open" class="custom-class" root-class-name="root-class-name" title="Basic Drawer"
        placement="right" @after-open-change="afterOpenChange">

        <a-form ref="form" :model="model" name="basic" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }"
            autocomplete="off" :rules="rules" labelAlign="right" >
            <a-form-item label="类型" v-if="!model.id">
                <a-radio-group v-model:value="model.menu_type">
                    <a-radio value="1">菜单</a-radio>
                    <a-radio value="2">页面</a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item label="菜单名称" name="menu_name">
                <a-input placeholder="菜单名称" v-model:value="model.menu_name" />
            </a-form-item>
            <a-form-item label="菜单路径" name="menu_address" v-if="model.menu_type === '2'">
                <a-input placeholder="菜单路径" v-model:value="model.menu_address" />
            </a-form-item>
            <a-form-item label="路由地址" name="route_address" v-if="model.menu_type === '2'">
                <a-input placeholder="路由地址" v-model:value="model.route_address" />
            </a-form-item>
            <a-form-item label="是否隐藏" name="hidden">
                <a-switch v-model:checked="model.hidden" />
            </a-form-item>
            <a-form-item label="是否启用" name="enabled">
                <a-switch v-model:checked="model.enabled" />
            </a-form-item>
        </a-form>
        <template #footer>
            <a-button type="primary" style="margin-right: 8px" @click="submit">确定</a-button>
            <a-button @click="hideDrawer">取消</a-button>
        </template>
    </a-drawer>
</template>

<script setup>
import { ref, reactive, defineEmits } from 'vue';
import { httpAction } from '@/api/manage.js'
const emit = defineEmits(['submitSuccess']);
const open = ref(false);
const form = ref(null)
let model = reactive({})
const httpUrl = reactive({
    add: 'SystemMenu/add',
    edit: 'SystemMenu/edit'
})
const rules = reactive({
    menu_name: [{ required: true, message: '请填写菜单名称' }],
    menu_address: [{ required: true, message: '请填写菜单路径' }],
    route_address: [{ required: true, message: '请填写路由地址' }],
    // hidden: [{ required: true, message: 'Please input your username!' }],
    // enabled: [{ required: true, message: 'Please input your password!' }],
})
const afterOpenChange = bool => {
    console.log('open', bool);
    if(!bool){
        resetModel()
    }
};
const resetModel = () => {
    for(let key in model){
            model[key] = undefined
        }
}
const hideDrawer = () => {
    resetModel()
    open.value = false
}
const showDrawer = (param = {}) => {

    if (param.id) {
        edit(param)
    } else {
        add(param)
    }
};
const add = (param) => {
    let obj = Object.assign({menu_type:'1'}, param)
    for (const key in obj) {
        model[key] = obj[key]; // 或者其他初始值
    }
    open.value = true;
}
const edit = (param) => {
    let obj  = Object.assign({}, param)
    for (const key in obj) {
        model[key] = obj[key]; // 或者其他初始值
    }
    console.log(model);
    open.value = true;
}

const submit = () => {
    form.value.validate().then(() => {
        let url
        let method
        if (model.id) {
            url = httpUrl.edit
            method = 'put'
        } else {
            url = httpUrl.add
            method = 'post'
        }
        httpAction(url, model, method).then(result => {
            console.log(result);
            if (result.code === '0000') {
                open.value = false;
                emit('submitSuccess')
            }
        }).catch(err => {
            console.log(err);
        })
    }).catch(() => {

    })

}

defineExpose({
    showDrawer
});
</script>

<style lang="less" scoped></style>