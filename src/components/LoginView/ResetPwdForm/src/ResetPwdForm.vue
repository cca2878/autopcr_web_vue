<script setup>
import { Lock, Refresh, User } from '@element-plus/icons-vue'
import { reactive, ref, watchEffect } from 'vue'

const props = defineProps(['username', 'dialogVisible'])
const emit = defineEmits(['update:dialogVisible'])

const visible = ref(false)

const loading = ref(false)

const formResetRef = ref()
const formReset = reactive({
  uname: '',
  pwd: '',
  checkPwd: ''
})
// const resetMsg = {
//   success: '重置成功',
//   fail: '重置失败，请联系管理员'
// }

const updateHandler = (value) => {
  emit('update:dialogVisible', value)
}

const validatePass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else {
    if (formReset.checkPwd !== '') {
      if (!formResetRef.value) return
      formResetRef.value.validateField('checkPwd', () => null)
    }
    callback()
  }
}
const validatePass2 = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('再次输入密码'))
  } else if (value !== formReset.pwd) {
    callback(new Error('两次输入不匹配'))
  } else {
    callback()
  }
}

const formResetRules = reactive({
  uname: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' },
    { pattern: /^[^\\|?*/]+$/g, message: '包含非法字符', trigger: 'blur' }
  ],
  pwd: [{ validator: validatePass, trigger: 'blur' }],
  checkPwd: [{ validator: validatePass2, trigger: 'blur' }]
})

watchEffect(() => {
  visible.value = props.dialogVisible
  formReset.uname = props.username
})
</script>

<template>
  <el-dialog
    v-model="visible"
    :destroy-on-close="true"
    title="重置密码"
    width="30%"
    @update:model-value="updateHandler"
  >
    <el-form
      ref="formResetRef"
      v-loading="loading"
      :model="formReset"
      :rules="formResetRules"
      :show-message="true"
      label-position="top"
      size="default"
    >
      <el-form-item class="form-item" prop="uname">
        <el-input v-model="formReset.uname" :prefix-icon="User" disabled placeholder="用户名" />
      </el-form-item>
      <el-form-item class="form-item" prop="pwd">
        <el-input
          v-model="formReset.pwd"
          :prefix-icon="Lock"
          clearable
          placeholder="密码"
          show-password
          type="password"
        />
      </el-form-item>
      <el-form-item class="form-item" prop="checkPwd">
        <el-input
          v-model="formReset.checkPwd"
          :prefix-icon="Refresh"
          clearable
          placeholder="确认密码"
          show-password
          type="password"
        />
      </el-form-item>
      <!--    <el-form-item class="form-item">-->
      <!--      <el-button style="width: 100%" type="primary" @click="onSubmit(formResetRef,formReset, resetFunc)">注册-->
      <!--      </el-button>-->
      <!--    </el-form-item>-->
    </el-form>
  </el-dialog>
</template>

<style scoped></style>
