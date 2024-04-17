import apiList from '@/http/apiList'
import axiosInstance from '@/http/request'
import { calcSHA256 } from '@/utils'

const postRegister = apiList.postRegister()

const registerConfig = {
  method: postRegister.method,
  url: postRegister.address,
  data: {
    qq: '',
    password: ''
  }
}

const postRegisterRequest = (qq, pwd) => {
  console.log(qq, pwd)
  registerConfig.data.qq = qq
  registerConfig.data.password = calcSHA256(apiList.salt(pwd))
  return axiosInstance(registerConfig)
}

export default postRegisterRequest
