import axiosInstance from '@/http/request'
import apiList from '@/http/apiList'

const getGetToolsConfigRequest = (acc) => {
  const getToolsConfig = apiList.getGetToolsConfig(acc)

  const getGetToolsConfigConfig = {
    method: getToolsConfig.method,
    url: getToolsConfig.address
  }
  return axiosInstance(getGetToolsConfigConfig)
}

export default getGetToolsConfigRequest
