<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  if_text: {
    type: Boolean,
    default: false
  },
  result: {
    type: String,
    default: '暂无数据'
  },
  loading: {
    type: Boolean,
    default: false
  },
  image: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <transition name="el-fade-in">
    <el-image
      v-show="!props.if_text"
      v-loading="props.loading"
      :src="props.image"
      fit="contain"
      style="width: 100%"
    ></el-image>
  </transition>
  <transition name="el-fade-in">
    <el-scrollbar max-height="200px">
      <el-text
        v-show="props.if_text"
        v-loading="props.loading"
        style="white-space: pre-wrap; word-break: break-all"
        tag="p"
      >
        {{ props.result }}
      </el-text>
    </el-scrollbar>
  </transition>
</template>

<style scoped></style>
