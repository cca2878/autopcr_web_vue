import axiosInstance from '@/http/request'
import apiList from '@/http/apiList'

const getGetAccountRequest = (acc) => {
  const getGetAccount = apiList.getGetAccount(acc)

  const getGetAccountConfig = {
    method: getGetAccount.method,
    url: getGetAccount.address
  }
  return axiosInstance(getGetAccountConfig)
}

export default getGetAccountRequest
