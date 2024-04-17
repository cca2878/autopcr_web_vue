<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Lock, User } from '@element-plus/icons-vue'
import ResetPwdForm from '../../ResetPwdForm'
import { formLoginModel, formLoginRef, formLoginRules } from './formValidate'
import { postQQLoginRequest } from '@/api'
import router from '@/router'
import { useStore } from '@/stores'

const store = useStore()
const dialogVisible = ref(false)

const loginFunc = (formModel) => {
  postQQLoginRequest(formModel.uname, formModel.pwd)
    .then(() => {
      store.setLogin(true)
      ElMessage.success(loginMsg.success)
      router.push({ name: 'home' })
    })
    .catch((err) => {
      console.log(err)
      loading.value = false
      if (err.response.status === 400) {
        ElMessage.error(loginMsg.incorrect)
      } else {
        ElMessage.error(loginMsg.fail)
      }
    })
}

const loginMsg = {
  success: '登录成功',
  incorrect: '用户名或密码错误',
  fail: '登录失败，请联系管理员'
  // absent: '账号不存在，请先注册'
}

const forgetMsg = {
  title: '忘记密码？',
  text: '自助重置开发中，请联系管理员重置密码。'
}

const loading = ref(false)

const onSubmit = async (formEl, formModel, action) => {
  if (!formEl) return
  loading.value = true

  // console.log(formLoginRef.value.model)
  await formEl.validate((valid, fields) => {
    if (valid) {
      action(formModel)
      console.log('submit!')
      // console.log(qs.stringify(formModel))
    } else {
      console.log('error submit!', fields)
      loading.value = false
    }
  })
}
</script>

<template>
  <ResetPwdForm v-model:dialogVisible="dialogVisible" :username="formLoginModel.uname" />
  <el-form
    ref="formLoginRef"
    v-loading="loading"
    :model="formLoginModel"
    :rules="formLoginRules"
    :show-message="false"
    hide-required-asterisk
    label-position="top"
    size="default"
    @keyup.enter="onSubmit(formLoginRef, formLoginModel, loginFunc)"
  >
    <el-form-item prop="uname" required>
      <el-input v-model="formLoginModel.uname" :prefix-icon="User" clearable placeholder="QQ" />
    </el-form-item>
    <el-form-item prop="pwd" required>
      <el-input
        v-model="formLoginModel.pwd"
        :prefix-icon="Lock"
        clearable
        placeholder="密码"
        show-password
        type="password"
      />
    </el-form-item>
    <el-form-item class="form-checkbox">
      <el-checkbox
        v-model="formLoginModel.autoLogin"
        checked
        disabled
        label="自动登录"
      ></el-checkbox>
      <div style="flex-grow: 1" />
      <el-link
        :underline="false"
        class="login-form-forgot"
        type="primary"
        @click="ElMessageBox.alert(forgetMsg.text, forgetMsg.title, { autofocus: false })"
      >
        忘记密码？
      </el-link>
      <!--      <el-link :underline="false" class="login-form-forgot" type="primary"-->
      <!--               @click="dialogVisible = true">-->
      <!--        忘记密码？-->
      <!--      </el-link>-->
    </el-form-item>
    <el-form-item class="form-item">
      <el-button
        style="width: 100%"
        type="primary"
        @click="onSubmit(formLoginRef, formLoginModel, loginFunc)"
        >登录
      </el-button>
    </el-form-item>
    <!--    <el-form-item class="form-item">-->
    <!--      <el-button style="width: 100%" type="primary" @click="onSubmit(formLoginRef, registerFunc)">注册</el-button>-->
    <!--    </el-form-item>-->
  </el-form>
</template>

<style scoped>
.form-checkbox {
  margin-left: 2px;
}
</style>
