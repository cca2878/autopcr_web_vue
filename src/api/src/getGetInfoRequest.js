import axiosInstance from '@/http/request'
import apiList from '@/http/apiList'

const getGetInfo = apiList.getGetInfo()

const getInfoConfig = {
  method: getGetInfo.method,
  url: getGetInfo.address
}

const getGetInfoRequest = () => axiosInstance(getInfoConfig)

export default getGetInfoRequest
