<script setup>
import { computed } from 'vue'

// modelValue: 每一行的完整数据
// drawer: 是否显示抽屉
// module: 当前抽屉对应的模块
const props = defineProps({
  modelValue: Object,
  drawer: Boolean,
  module: Object
})
const emit = defineEmits(['update:modelValue', 'update:drawer', 'update:module'])

const drawer = computed({
  get: () => props.drawer,
  set: (val) => {
    console.log(val)
    emit('update:drawer', val)
  }
})

const modelValue = computed({
  get: () => props.modelValue,
  set: (val) => {
    console.log(val)
    emit('update:modelValue', val)
  }
})

const module = computed({
  get: () => props.module,
  set: (val) => {
    console.log(val)
    emit('update:module', val)
  }
})
</script>

<template>
  <el-drawer v-model="drawer">
    <template #header>
      <h4>{{ module.title }}</h4>
    </template>
    <template #default>
      <!--      {{ modelValue }}-->
      <!--      <el-input-->
      <!--          v-model="modelValue"-->
      <!--          :rows="2"-->
      <!--          type="textarea"-->
      <!--          placeholder="Please input"-->
      <!--      />-->
      <el-form label-width="auto">
        <el-form-item v-for="item in module.props" :key="item.key" :label="item.title">
          <template v-if="item.prop_type === 'bool'">
            <el-switch
              v-model="modelValue.config[item.key]"
              :active-value="item.candidates['1']"
              :inactive-value="item.candidates['0']"
            />
          </template>
          <template v-else-if="item.prop_type === 'single'">
            <el-select v-model="modelValue.config[item.key]" placeholder="请选择">
              <el-option
                v-for="(value, key) in item.candidates"
                :key="key"
                :label="value"
                :value="key"
              />
            </el-select>
          </template>
          <template v-else-if="item.prop_type === 'multi'">
            <el-select v-model="modelValue.config[item.key]" multiple placeholder="请选择">
              <el-option
                v-for="(value, key) in item.candidates"
                :key="key"
                :label="value"
                :value="key"
              />
            </el-select>
          </template>
          <template v-else-if="item.prop_type === 'num'">
            <el-input-number
              v-model="modelValue.config[item.key]"
              :max="item.candidates[1]"
              :min="item.candidates[0]"
              :step="item.candidates[2]"
            />
          </template>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancelClick">cancel</el-button>
        <el-button type="primary" @click="confirmClick">confirm</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<style scoped></style>
