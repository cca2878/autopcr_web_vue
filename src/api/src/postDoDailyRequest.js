import apiList from '@/http/apiList'
import axiosInstance from '@/http/request'

const postDoDailyRequest = (acc, text_result) => {
  const postDoDaily = apiList.postDoDaily(acc)

  const doDailyConfig = {
    method: postDoDaily.method,
    url: postDoDaily.address,
    data: {
      text_result: text_result
    }
  }
  console.log('postDoDailyRequest', text_result)
  return axiosInstance(doDailyConfig)
}

export default postDoDailyRequest
