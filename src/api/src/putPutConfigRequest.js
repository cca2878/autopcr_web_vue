import apiList from '@/http/apiList'
import axiosInstance from '@/http/request'

const putPutConfigRequest = (acc, data) => {
  const putPutConfig = apiList.putPutConfig(acc)
  const putConfigConfig = {
    method: putPutConfig.method,
    url: putPutConfig.address,
    data: data
  }
  console.log(data)
  return axiosInstance(putConfigConfig)
}

export default putPutConfigRequest
