import apiList from '@/http/apiList'
import axiosInstance from '@/http/request'
import { calcSHA256 } from '@/utils'

const postModifyProfile = apiList.postModifyProfile()

const modifyProfileConfig = {
  method: postModifyProfile.method,
  url: postModifyProfile.address,
  data: {
    pwd_hash: ''
  }
}

const postModifyProfileRequest = (qq = null, pwd) => {
  if (qq) {
    modifyProfileConfig.data.user_qq = qq
  }
  modifyProfileConfig.data.pwd_hash = calcSHA256(apiList.salt(pwd))
  return axiosInstance(modifyProfileConfig)
}

export default postModifyProfileRequest
