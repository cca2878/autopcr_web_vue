import axiosInstance from '@/http/request'
import apiList from '@/http/apiList'

const deleteUpdateAccount = (acc) => {
  const deleteUpdateAccount = apiList.deleteUpdateAccount(acc)
  const getInfoConfig = {
    method: deleteUpdateAccount.method,
    url: deleteUpdateAccount.address
  }
  return axiosInstance(getInfoConfig)
}

export default deleteUpdateAccount
