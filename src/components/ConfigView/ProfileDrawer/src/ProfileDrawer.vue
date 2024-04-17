<script setup>
import { ref } from 'vue'

const drawer = ref(false)
</script>

<template>
  <el-button type="primary" @click="drawer = true">编辑</el-button>
  <el-drawer v-model="drawer">
    <template #header>
      <h4>set title by slot</h4>
    </template>
    <template #default>
      <div>
        <el-radio label="Option 1" size="large">Option 1 </el-radio>
        <el-radio label="Option 2" size="large">Option 2 </el-radio>
      </div>
    </template>
  </el-drawer>
</template>

<style scoped></style>
