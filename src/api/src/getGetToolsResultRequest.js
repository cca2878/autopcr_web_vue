import axiosInstance from '@/http/request'
import apiList from '@/http/apiList'

const getGetToolsResultRequest = (acc) => {
  const getToolsResult = apiList.getGetToolsResult(acc)

  const getGetToolsResultConfig = {
    method: getToolsResult.method,
    url: getToolsResult.address
  }
  return axiosInstance(getGetToolsResultConfig)
}

export default getGetToolsResultRequest
