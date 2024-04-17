<script setup>
import { computed, defineEmits, defineProps, reactive, ref, watch } from 'vue'
import axiosInstance from '@/http/request'
import apiList from '@/http/apiList'
import { ElMessage } from 'element-plus'

/*
 * accList直接采用accTableData
 * */
const props = defineProps({
  visible: Boolean,
  accList: Array,
  defaultAcc: String
})
const emit = defineEmits(['update:visible', 'putDefaultAcc'])

const showDialog = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})

const formRef = ref()
const formModel = reactive({
  acc: ''
})
watch(
  () => props.defaultAcc,
  (newVal) => {
    formModel.acc = newVal
  }
)
const formRules = {
  acc: [{ required: true, message: '请选择账号', trigger: 'blur' }]
}

const putPutDefaultAccount = apiList.putPutDefaultAccount()
const putDefaultAccountConfig = {
  method: putPutDefaultAccount.method,
  url: putPutDefaultAccount.address,
  data: {
    default_account: ''
  }
}
const putDefaultAccount = (acc) => {
  putDefaultAccountConfig.data.default_account = acc
  axiosInstance(putDefaultAccountConfig).then((res) => {
    console.log(res)
    afterPutDefaultAccount()
  })
}
const afterPutDefaultAccount = () => {
  ElMessage.success('设置成功')
  emit('putDefaultAcc', formModel.acc)
  showDialog.value = false
  formRef.value.resetFields()
}
const submitForm = async (formEl) => {
  if (!formEl) {
    console.log('formEl is null')
    return
  }
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
      putDefaultAccount(formModel.acc)
    } else {
      console.log('error submit!', fields)
    }
  })
}
</script>

<template>
  <el-dialog v-model="showDialog" title="设置默认账号" width="40%">
    <el-form
      ref="formRef"
      :model="formModel"
      :rules="formRules"
      class="form-inline"
      inline
      label-width="auto"
    >
      <el-form-item label="账号" prop="acc">
        <el-select v-model="formModel.acc" filterable placeholder="请选择账号">
          <el-option
            v-for="item in props.accList"
            :key="item"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(formRef)">确定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<style lang="scss">
.form-inline {
  .el-select {
    --el-select-width: 220px;
  }
}
</style>
