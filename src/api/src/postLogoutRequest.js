import apiList from '@/http/apiList'
import axiosInstance from '@/http/request'

const postLogout = apiList.postLogout()
const logoutConfig = {
  method: postLogout.method,
  url: postLogout.address
}
const postLogoutRequest = () => {
  return axiosInstance(logoutConfig)
}

export default postLogoutRequest
