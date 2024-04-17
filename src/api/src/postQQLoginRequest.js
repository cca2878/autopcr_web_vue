import apiList from '@/http/apiList'
import axiosInstance from '@/http/request'
import { calcSHA256 } from '@/utils'

const postQQLogin = apiList.postQQLogin()

const qqLoginConfig = {
  method: postQQLogin.method,
  url: postQQLogin.address,
  data: {
    qq: '',
    password: ''
  }
}

const postQQLoginRequest = (qq, pwd) => {
  console.log(qq, pwd)
  qqLoginConfig.data.qq = qq
  qqLoginConfig.data.password = calcSHA256(apiList.salt(pwd))
  return axiosInstance(qqLoginConfig)
}

export default postQQLoginRequest
