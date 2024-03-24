<template>
  <div class="modal fade" :id="id" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog" :style="{maxWidth:width}">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="staticBackdropLabel">{{title}}</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"  @click="close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <slot></slot>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="close">关闭</button>
        <button type="button" class="btn btn-primary" @click="ok">确定</button>
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