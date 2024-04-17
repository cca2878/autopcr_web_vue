import apiList from '@/http/apiList'
import axiosInstance from '@/http/request'

const postDoSingleRequest = (acc, order, text_result) => {
  const postDoSingle = apiList.postDoSingle(acc)

  const doSingleConfig = {
    method: postDoSingle.method,
    url: postDoSingle.address,
    data: {
      order: order,
      text_result: text_result
    }
  }
  console.log(order, text_result)
  return axiosInstance(doSingleConfig)
}

export default postDoSingleRequest
