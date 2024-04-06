<template>
<div class="modal fade"   :id="id" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content" :style="{width:props.width}">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">{{title}}</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"  @click="close"></button>
      </div>
      <div class="modal-body">
        <slot></slot>
       
      </div>
      
    </div>
  </div>
</div>
</template>

<script setup>
import { withDefaults, defineProps } from 'vue'

// 定义 props
const props = defineProps({
  id: {
    type: String,
    default: 'default-id'
  },
  title: {
    type: String,
    default: '默认标题'
  },
  width: {
    type: String,
    default: '800px'
  }
})
const emit = defineEmits(['close'])
const close = () => {
    emit('close')
}
const ok = () => {
    emit('ok')

}
</script>

<style lang="less" scoped>

</style>