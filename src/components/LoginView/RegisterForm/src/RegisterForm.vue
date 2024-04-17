<script setup>
import { reactive, ref } from 'vue'
import { Lock, Refresh, User } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { postRegisterRequest } from '@/api'
import router from '@/router'
import { useStore } from '@/stores'
import { uniFormVali } from '@/utils'

const loading = ref(false)
const store = useStore()
const formRegisterRef = ref()
const formRegister = reactive({
  uname: '',
  pwd: '',
  checkPwd: ''
})
const registerMsg = {
  success: '注册成功',
  fail: '注册失败，请联系管理员',
  duplicated: '账号已存在，请直接登录'
}
const validatePass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else {
    // if (formRegister.checkPwd !== '') {
    //   if (!formRegisterRef.value) return
    //   formRegisterRef.value.validateField('checkPwd', () => null)
    // }
    callback()
  }
}
const validatePass2 = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== formRegister.pwd) {
    callback(new Error('两次输入不匹配'))
  } else {
    callback()
  }
}

const formRegisterRules = reactive({
  uname: [
    { required: true, message: '请输入QQ', trigger: 'blur' },
    // {min: 5, max: 12, message: '长度在 1 到 32 个字符', trigger: 'blur'},
    { pattern: /\d{5,12}/g, message: '请输入正确的QQ', trigger: 'blur' }
  ],
  pwd: [{ validator: validatePass, trigger: 'blur' }],
  checkPwd: [{ validator: validatePass2, trigger: 'blur' }]
})

const onSubmit = async (formEl, formModel, action) => {
  loading.value = true
  await uniFormVali(
    formEl,
    () => {
      action(formModel)
      console.log('submit!')
    },
    (fields) => {
      console.log('error submit!', fields)
      loading.value = false
    }
  )
}

const registerFunc = (formModel) => {
  console.log(formModel.uname)
  postRegisterRequest(formModel.uname, formModel.pwd)
    .then(() => {
      ElMessage.success(registerMsg.success)
      loading.value = false
      store.setLogin(true)
      router.push({ name: 'home' })
    })
    .catch(() => {
      loading.value = false
    })
}
</script>

<template>
  <el-form
    ref="formRegisterRef"
    v-loading="loading"
    :model="formRegister"
    :rules="formRegisterRules"
    :show-message="true"
    label-position="top"
    size="default"
  >
    <el-form-item class="form-item" prop="uname">
      <el-input v-model="formRegister.uname" :prefix-icon="User" clearable placeholder="用户名" />
    </el-form-item>
    <el-form-item class="form-item" prop="pwd">
      <el-input
        v-model="formRegister.pwd"
        :prefix-icon="Lock"
        clearable
        placeholder="密码"
        show-password
        type="password"
      />
    </el-form-item>
    <el-form-item class="form-item" prop="checkPwd">
      <el-input
        v-model="formRegister.checkPwd"
        :prefix-icon="Refresh"
        clearable
        placeholder="确认密码"
        show-password
        type="password"
      />
    </el-form-item>
    <el-form-item class="form-item">
      <el-button
        style="width: 100%"
        type="primary"
        @click="onSubmit(formRegisterRef, formRegister, registerFunc)"
        >注册
      </el-button>
    </el-form-item>
    <!--    <el-form-item class="form-item">-->
    <!--      <el-button style="width: 100%" type="primary" @click="onSubmit(formLoginRef, registerFunc)">注册</el-button>-->
    <!--    </el-form-item>-->
  </el-form>
</template>

<style scoped>
.form-item {
}
</style>
