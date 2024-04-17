<script setup>
import { computed, defineProps } from 'vue'
import { Picture } from '@element-plus/icons-vue'

const props = defineProps({
  ifResultText: Boolean,
  imageUrl: String,
  loading: Boolean,
  result: {
    type: Object,
    default: () => {}
  }
})

const tableData = computed(() => {
  try {
    const tempList = []
    for (let value of props.result['order']) {
      tempList.push(props.result['result'][value])
    }
    return tempList
  } catch (e) {
    return []
  }
})

const resultTagType = {
  success: 'success',
  abort: 'warning',
  error: 'danger',
  skip: 'info'
}
</script>

<template>
  <transition name="el-fade-in">
    <el-table v-show="props.ifResultText" v-loading="props.loading" :data="tableData" fit stripe>
      <!--      <el-table-column label="序号" type="index"/>-->
      <el-table-column label="名称" prop="name" />
      <el-table-column label="配置" prop="config">
        <template #default="scope">
          <div style="white-space: pre-wrap; word-break: break-all">
            {{ scope.row.config }}
          </div>
        </template>
      </el-table-column>
      <el-table-column :width="80" label="状态" prop="status">
        <template #default="scope">
          <el-text :type="resultTagType[scope.row.status]">{{ scope.row.status }}</el-text>
        </template>
      </el-table-column>
      <el-table-column label="结果" prop="log">
        <template #default="scope">
          <div style="white-space: pre-wrap; word-break: break-all">
            {{ scope.row.log }}
          </div>
        </template>
      </el-table-column>
    </el-table>
  </transition>
  <transition name="el-fade-in">
    <el-image
      v-show="!props.ifResultText"
      v-loading="props.loading"
      :src="props.imageUrl"
      style="width: 100%"
    >
      <template #error>
        <div class="image-slot">
          <el-icon>
            <Picture />
          </el-icon>
        </div>
      </template>
    </el-image>
  </transition>
</template>
<style lang="scss">
.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  font-size: 30px;
}
</style>
