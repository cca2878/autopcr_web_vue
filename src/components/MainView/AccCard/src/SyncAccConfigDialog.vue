<script setup>
import { computed, defineEmits, defineProps, reactive, ref, watch } from 'vue'
import axiosInstance from '@/http/request'
import apiList from '@/http/apiList'
import { uniFormVali } from '@/utils'
import { ElMessage } from 'element-plus'

/*
 * accList直接采用accTableData
 * */
const props = defineProps({
  visible: Boolean,
  accList: Array
})
const emit = defineEmits(['update:visible', 'syncAccConfig'])

const showDialog = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})
const formRef = ref()
const formModel = reactive({
  acc: '',
  target: []
})
const formRules = {
  acc: [{ required: true, message: '请选择源账号', trigger: 'blur' }],
  target: [{ required: true, message: '请选择目标账号', trigger: 'blur' }]
}

const postSyncAccConfig = apiList.postSyncAccountConfig()
const syncAccountConfig = {
  method: postSyncAccConfig.method,
  url: postSyncAccConfig.address,
  data: {
    alias: '',
    target: []
  }
}
const postSyncAccConfigRequest = (acc, target = []) => {
  syncAccountConfig.data.alias = acc
  syncAccountConfig.data.target = target
  return axiosInstance(syncAccountConfig)
}
const syncAccConfig = (acc, target = []) => {
  postSyncAccConfigRequest(acc, target).then((res) => {
    console.log(res)
    afterSyncAccConfig()
  })
}
const afterSyncAccConfig = () => {
  emit('syncAccConfig')
  ElMessage.success('同步成功')
  showDialog.value = false
}

const checkAll = ref(false)
const indeterminate = ref(false)
const handleCheckAll = (val) => {
  indeterminate.value = false
  if (val) {
    formModel.target = props.accList.map((_) => _.name)
  } else {
    formModel.target = []
  }
}
watch(
  () => formModel.target,
  (val) => {
    if (val.length === 0) {
      checkAll.value = false
      indeterminate.value = false
    } else if (val.length === props.accList.length) {
      checkAll.value = true
      indeterminate.value = false
    } else {
      indeterminate.value = true
    }
  }
)
const submitForm = (formRef) =>
  uniFormVali(formRef, () =>
    syncAccConfig(formModel.acc, checkAll.value ? undefined : formModel.target)
  )
</script>
<template>
  <el-dialog v-model="showDialog" title="同步账号配置" @close="formRef.resetFields()">
    <el-form ref="formRef" :model="formModel" :rules="formRules" label-position="top">
      <el-form-item label="源账号" prop="acc">
        <el-select v-model="formModel.acc" filterable placeholder="选择源账号">
          <el-option
            v-for="item in props.accList"
            :key="item"
            :label="item.name"
            :value="item.name"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="目标账号" prop="target">
        <el-select
          v-model="formModel.target"
          :max-collapse-tags="5"
          clearable
          collapse-tags
          collapse-tags-tooltip
          filterable
          multiple
          placeholder="选择目标账号"
          popper-class="custom-header"
        >
          <template #header>
            <el-checkbox v-model="checkAll" :indeterminate="indeterminate" @change="handleCheckAll">
              全选
            </el-checkbox>
          </template>
          <el-option
            v-for="item in props.accList"
            :key="item"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(formRef)">同步</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<style lang="scss">
.custom-header {
  .el-checkbox {
    display: flex;
    height: unset;
  }
}
</style>
