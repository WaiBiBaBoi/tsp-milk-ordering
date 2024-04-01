<template>
    <a-drawer width="600px" v-model:open="open" class="custom-class" root-class-name="root-class-name" :title="title"
        placement="right" @after-open-change="afterOpenChange">
        <a-form ref="form" :model="model" name="basic" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }"
            autocomplete="off" :rules="rules" labelAlign="right" >
            <a-form-item label="商品名称" name="product_name">
                <a-input placeholder="商品名称" v-model:value="model.commodity_name" />
            </a-form-item>
            <a-form-item label="商品简介" name="introduction" >
                <a-textarea v-model:value="model.introduction" placeholder="商品简介" :rows="4" />
            </a-form-item>
            <a-form-item label="单价" name="price" >
                <a-input-number v-model:value="model.price" :min="1"  />
            </a-form-item>
            <a-form-item label="库存" name="reserve" >
                <a-input-number v-model:value="model.reserve" :min="1"  />
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
import { message } from 'ant-design-vue';
// const props = defineProps({
//   title: {
//     type: String,
//     default: "Basic Drawer"
//   },
// })
let title = ref('')
const emit = defineEmits(['childSubmitSuccess']);
const open = ref(false);
const form = ref(null)
let model = reactive({
    boutique:false,
    is_available:false
})
const httpUrl = reactive({
    add: 'Commodity/add',
    edit: 'Commodity/edit'
})
const rules = reactive({
    // title: [{ required: true, message: '请填写角色名称' }],
    // image: [{ required: true, message: '请上传图片' }],
    
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
        title.value = '编辑商品'
    } else {
        add(param)
        title.value = '添加商品'
    }
};
const add = (param) => {
    model = Object.assign(model, param)
    open.value = true;
}
const edit = (param) => {
    model = Object.assign(model, param)
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
                if(model.id){
                    message.success('编辑成功')
                }else{
                    message.success('添加成功')
                }
                emit('childSubmitSuccess')
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