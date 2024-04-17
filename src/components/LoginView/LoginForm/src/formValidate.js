import { reactive, ref } from 'vue'

const formLoginRef = ref()

const formLoginModel = reactive({
  uname: '',
  pwd: '',
  autoLogin: false
})
const formLoginRules = reactive({
  uname: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' },
    { pattern: /^[^\\|?*/]+$/g, message: '包含非法字符', trigger: 'blur' }
  ]
})

export { formLoginRef, formLoginModel, formLoginRules }
