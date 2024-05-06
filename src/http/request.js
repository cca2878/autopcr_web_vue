// http/request.js
import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '../router/index.js'
import apiList from '@/http/apiList'
import { useStore } from '@/stores'

const store = useStore()
//创建axios的一个实例
let axiosInstance = axios.create({
  baseURL: apiList.baseURL, //接口统一域名
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

axiosInstance.interceptors.response.use(
  (response) => {
    // 如果响应状态码为200，那么直接返回响应
    if (response.status === 200) {
      return response
    }
  },
  (error) => {
    // 如果响应状态码为401，那么重定向到登录页面
    if (error.response && error.response.status === 401) {
      store.setLogin(false)
      router.push('login')
    } else {
      let { message } = error
      ElMessage({
        message: message,
        type: 'error'
      })
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
