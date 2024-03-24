<template>
    <a-drawer width="600px" v-model:open="open" class="custom-class" root-class-name="root-class-name" title="Basic Drawer"
        placement="right" @after-open-change="afterOpenChange">
        <a-form ref="form" :model="model" name="basic" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }"
            autocomplete="off" :rules="rules" labelAlign="right" >
            <a-form-item label="字典名称" name="dict_name">
                <a-input placeholder="字典名称" v-model:value="model.dict_name" />
            </a-form-item>
            <a-form-item label="字典编号" name="dict_code">
                <a-input placeholder="字典编号" v-model:value="model.dict_code" />
            </a-form-item>
            <a-form-item label="字典描述" name="dict_describe" >
                <a-textarea v-model:value="model.dict_describe" placeholder="备注" :rows="4" />
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
    add: 'SystemDataDict/add',
    edit: 'SystemDataDict/edit'
})
const rules = reactive({
    dict_name: [{ required: true, message: '请填写字典名称' }],
    dict_code: [{ required: true, message: '请填写字典编号' }],
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
    model = Object.assign(model, param)
    open.value = true;
}
const edit = (param) => {
    model = Object.assign({}, param)
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