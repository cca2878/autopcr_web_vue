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

// 响应拦截器
// instance.interceptors.response.use(res => {
//         // 未设置状态码则默认成功状态
//         const code = res.data.code || 0;
//         // 获取错误信息
//         const msg = res.data.msg
//         // 二进制数据则直接返回
//         if (res.request.responseType === 'blob' || res.request.responseType === 'arraybuffer') {
//             return res.data
//         }
//
//         if (code === 0) {
//             return res.data
//         } else {
//             ElMessage.error(msg)
//             if (res.data.data === "quit") {
//                 localStorage.removeItem("token")
//                 router.push("/login")
//             }
//             return Promise.reject(new Error(msg))
//         }
//     },
//     error => {
//         console.log('err' + error)
//
//         let {message} = error;
//         if (message === "Network Error") {
//             message = "后端接口连接异常";
//         } else if (message.includes("timeout")) {
//             message = "系统接口请求超时";
//         } else if (message.includes("Request failed with status code")) {
//             message = "系统接口" + message.substring(message.length - 3) + "异常";
//             //遇到cloudflare防火墙就刷新
//             let {response} = error
//             if (response['data'] && response['data'].indexOf('Just a moment...') !== -1) {
//                 window.location.reload()
//             }
//         }
//
//
//         ElMessage({
//             message: message,
//             type: 'error',
//             duration: 5 * 1000
//         })
//         return Promise.reject(error)
//     }
// )

/**
 * @param {String} method  请求的方法：get、post、delete、put
 * @param {String} url     请求的url:
 * @param {Object} data    请求的参数
 * @param {Object} config  请求的配置
 * @returns {Promise}     返回一个promise对象，其实就相当于axios请求数据的返回值
 */

// const tRequest = ({
//                       method,
//                       url,
//                       data,
//                       config
//                   }) => {
//     method = method.toLowerCase();
//     if (method === 'post') {
//         return instance.post(url, data, {...config})
//     } else if (method === 'get') {
//         return instance.get(url, {
//             params: data,
//             ...config
//         })
//     } else if (method === 'delete') {
//         return instance.delete(url, {
//             params: data,
//             ...config
//         },)
//     } else if (method === 'put') {
//         return instance.put(url, data, {...config})
//     } else {
//         console.error('未知的method' + method)
//         return false
//     }
// }
// export default {tRequest}
