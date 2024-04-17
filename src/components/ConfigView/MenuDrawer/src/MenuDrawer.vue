<script setup>
import { House } from '@element-plus/icons-vue'

// 定义一个props来接收外部传入的值
const props = defineProps({
  drawerVisible: Boolean
})

// 当el-drawer的状态改变时，通过emit发送自定义事件
const emit = defineEmits(['closeDrawer'])
const onDrawerClose = () => {
  emit('closeDrawer')
}
</script>

<template>
  <el-drawer
    :model-value="props.drawerVisible"
    :with-header="false"
    direction="ltr"
    @close="onDrawerClose"
  >
    <template #default>
      <el-scrollbar>
        <el-menu>
          <el-sub-menu>
            <template #title>
              <el-icon>
                <House />
              </el-icon>
              <el-text size="default">导航1</el-text>
            </template>
            <el-menu-item>
              <el-icon>
                <House />
              </el-icon>
              <el-text size="default">导航1</el-text>
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item v-for="i in 15" :key="i">
            <el-icon>
              <House />
            </el-icon>
            <el-text size="default">导航1</el-text>
          </el-menu-item>
        </el-menu>
      </el-scrollbar>
    </template>
  </el-drawer>
</template>

<style lang="scss">
.el-drawer__body {
  padding: 0;
}
</style>
