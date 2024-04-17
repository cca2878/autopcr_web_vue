import axiosInstance from '@/http/request'
import apiList from '@/http/apiList'

const getGetDailyConfigRequest = (acc) => {
  const getDailyConfig = apiList.getGetDailyConfig(acc)

  const getDailyConfigConfig = {
    method: getDailyConfig.method,
    url: getDailyConfig.address
  }
  return axiosInstance(getDailyConfigConfig)
}

export default getGetDailyConfigRequest
