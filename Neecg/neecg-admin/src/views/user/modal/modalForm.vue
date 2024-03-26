<template>
    <a-drawer width="600px" v-model:open="open" class="custom-class" root-class-name="root-class-name" :title="props.title"
        placement="right" @after-open-change="afterOpenChange">

        <a-form ref="form" :model="model" name="basic" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }"
            autocomplete="off" :rules="rules" labelAlign="right" >
            <a-form-item label="用户名" name="title">
                <a-input placeholder="用户名" v-model:value="model.user_name" />
            </a-form-item>
            <a-form-item label="用户账号" name="introduction" >
                <a-input v-model:value="model.user_account" placeholder="用户账号"  />
            </a-form-item>
            <a-form-item label="密码" name="introduction" >
                <a-input v-model:value="model.user_password" placeholder="密码"  />
            </a-form-item>
            <!-- <a-form-item label="启用" name="is_using" >
                <a-switch v-model:checked="model.is_using" />
            </a-form-item> -->
            <a-form-item label="头像" name="image" >
                <n-upload v-model="model.avatar"></n-upload>
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
const props = defineProps({
  title: {
    type: String,
    default: "编辑"
  },
})

const emit = defineEmits(['submitSuccess']);
const open = ref(false);
const form = ref(null)
let model = reactive({})
const httpUrl = reactive({
    add: 'User/add',
    edit: 'User/edit'
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
    } else {
        add(param)
    }
};
const add = (param) => {
    model = Object.assign({}, param)
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