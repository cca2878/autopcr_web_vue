<script setup>
import { Lock, Refresh, User } from '@element-plus/icons-vue'
import { computed, reactive, ref, watchEffect } from 'vue'
import { uniFormVali } from '@/utils'
import { postModifyProfileRequest } from '@/api'
import { ElMessage } from 'element-plus'

const props = defineProps(['username', 'dialogVisible'])
const emit = defineEmits(['update:dialogVisible'])

const showDialog = computed({
  get: () => props.dialogVisible,
  set: (val) => emit('update:dialogVisible', val)
})

const loading = ref(false)
const submittable = ref(false)

const formRef = ref()
const formModel = reactive({
  uname: props.username,
  pwd: '',
  checkPwd: ''
})

// const resetMsg = {
//   success: '重置成功',
//   fail: '重置失败，请联系管理员',
// }

// const updateHandler = (value) => {
//   emit('update:dialogVisible', value)
// }

const validatePass = (rule, value, callback) => {
  if (value === '') {
    callback()
    // callback(new Error('请输入密码'))
  } else {
    // if (formModel.checkPwd !== '') {
    //   if (!formRef.value) return
    //   formRef.value.validateField('checkPwd', () => null)
    // }
    callback()
  }
}
const validatePass2 = (rule, value, callback) => {
  if (value === '' && formModel.pwd !== '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== formModel.pwd) {
    callback(new Error('两次输入不匹配'))
  } else {
    callback()
  }
}

const formRules = reactive({
  uname: [
    { required: true, message: '请输入QQ', trigger: 'blur' },
    // {min: 5, max: 12, message: '长度在 1 到 32 个字符', trigger: 'blur'},
    { pattern: /\d{5,12}/g, message: '请输入正确的QQ', trigger: 'blur' }
  ],
  pwd: [{ validator: validatePass, trigger: 'blur' }],
  checkPwd: [{ validator: validatePass2, trigger: 'blur' }]
})

const onSubmit = async (formEl, formModel, action) => {
  await uniFormVali(
    formEl,
    () => {
      action(formModel)
      console.log('submit!')
    },
    (fields) => {
      console.log('error submit!', fields)
      // loading.value = false
    }
  )
}

watchEffect(() => {
  formModel.uname === props.username && formModel.pwd === ''
    ? (submittable.value = false)
    : (submittable.value = true)
  // formModel.uname = props.username
})

const modifyProfile = (formModel) => {
  const user_qq = formModel.uname === props.username ? null : formModel.uname
  console.log(user_qq, formModel.pwd)
  loading.value = true
  postModifyProfileRequest(user_qq, formModel.pwd)
    .then(() => {
      loading.value = false
      console.log('modify success')
      ElMessage.success('修改成功')
      formRef.value.resetFields()
      emit('update:dialogVisible', false)
    })
    .catch(() => {
      loading.value = false
    })
}
</script>

<template>
  <el-dialog v-model="showDialog" :destroy-on-close="true" title="修改个人资料" width="30%">
    <el-form
      ref="formRef"
      v-loading="loading"
      :model="formModel"
      :rules="formRules"
      :show-message="true"
      label-position="top"
      size="default"
    >
      <el-form-item>
        <el-text>注：密码留空即为不修改；若修改了QQ，则需要重新登陆。</el-text>
      </el-form-item>
      <el-form-item class="form-item" prop="uname">
        <el-input v-model="formModel.uname" :prefix-icon="User" placeholder="用户名" />
      </el-form-item>
      <el-form-item class="form-item" prop="pwd">
        <el-input
          v-model="formModel.pwd"
          :prefix-icon="Lock"
          clearable
          placeholder="密码"
          show-password
          type="password"
        />
      </el-form-item>
      <el-form-item class="form-item" prop="checkPwd">
        <el-input
          v-model="formModel.checkPwd"
          :prefix-icon="Refresh"
          clearable
          placeholder="确认密码"
          show-password
          type="password"
        />
      </el-form-item>
      <el-form-item class="form-item">
        <el-button
          :disabled="!submittable"
          style="width: 100%"
          type="primary"
          @click="onSubmit(formRef, formModel, modifyProfile)"
          >提交
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<style scoped></style>
