<script setup>
import { computed, defineEmits, defineProps, reactive, ref } from 'vue'
import axiosInstance from '@/http/request'
import apiList from '@/http/apiList'
import { ElMessage } from 'element-plus'
import { uniFormVali } from '@/utils'

const props = defineProps({
  visible: Boolean
})
const emit = defineEmits(['update:visible', 'created'])

const showDialog = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})

const formRef = ref()
const formModel = reactive({
  acc: ''
})
const formRules = {
  acc: [{ required: true, message: '请输入账号', trigger: 'blur' }]
}

const postCreateAccount = apiList.postCreateAccount()
const createAccountConfig = {
  method: postCreateAccount.method,
  url: postCreateAccount.address,
  data: {
    alias: ''
  }
}
const createAccount = (acc) => {
  createAccountConfig.data.alias = acc
  axiosInstance(createAccountConfig).then((res) => {
    console.log(res)
    afterCreateAccount()
  })
}
const afterCreateAccount = () => {
  ElMessage.success('添加成功')
  emit('created', formModel.acc)
  showDialog.value = false
  formRef.value.resetFields()
}
// const submitForm = async (formEl) => {
//   if (!formEl) {
//     console.log('formEl is null')
//     return
//   }
//   await formEl.validate((valid, fields) => {
//     if (valid) {
//       console.log('submit!')
//       createAccount(formModel.acc)
//     } else {
//       console.log('error submit!', fields)
//     }
//   })
// }
const submitForm = (formRef) => uniFormVali(formRef, () => createAccount(formModel.acc))
</script>

<template>
  <el-dialog v-model="showDialog" title="添加账号" width="30%">
    <el-form ref="formRef" :model="formModel" :rules="formRules" inline label-width="auto">
      <el-form-item label="账号" prop="acc">
        <el-input v-model="formModel.acc" placeholder="请输入账号" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(formRef)">添加</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<style scoped></style>
