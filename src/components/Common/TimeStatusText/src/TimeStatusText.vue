<script setup>
import {
  CircleCheckFilled,
  CircleCloseFilled,
  InfoFilled,
  Loading,
  WarningFilled
} from '@element-plus/icons-vue'

const props = defineProps({
  status: {
    type: String,
    default: 'skip'
  },
  last_time: {
    type: String,
    default: '暂无数据'
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const resultTagIcon = {
  success: CircleCheckFilled,
  abort: WarningFilled,
  error: CircleCloseFilled,
  skip: InfoFilled
}

const resultTagType = {
  success: 'success',
  abort: 'warning',
  error: 'danger',
  skip: 'info'
}
</script>

<template>
  <el-space :size="4">
    <el-text :type="resultTagType[props.status]">
      <template v-if="!props.loading">
        <el-icon>
          <component :is="resultTagIcon[props.status]" />
        </el-icon>
      </template>
      <template v-else>
        <el-icon class="is-loading">
          <Loading />
        </el-icon>
      </template>
    </el-text>
    <el-text>
      {{ props.loading ? 'Loading...' : props.last_time }}
    </el-text>
  </el-space>
</template>

<style scoped></style>
