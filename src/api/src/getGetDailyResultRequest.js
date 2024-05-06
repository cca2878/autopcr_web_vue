import axiosInstance from '@/http/request'
import apiList from '@/http/apiList'

const getGetDailyResultRequest = (acc, result_id, text_result) => {
  const getDailyResult = apiList.getGetDailyResult(acc, result_id, text_result)

  const getDailyResultConfig = {
    method: getDailyResult.method,
    url: getDailyResult.address,
    params: {
      text: text_result
    }
  }
  return axiosInstance(getDailyResultConfig)
}

export default getGetDailyResultRequest
