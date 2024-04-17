import apiList from '@/http/apiList'
import axiosInstance from '@/http/request'

const putUpdateAccountRequest = (acc, uname, pwd) => {
  const putUpdateAccount = apiList.putUpdateAccount(acc)
  const updateAccountConfig = {
    method: putUpdateAccount.method,
    url: putUpdateAccount.address,
    data: {
      username: `${uname}`,
      password: `${pwd}`
    }
  }
  console.log(uname, pwd)
  return axiosInstance(updateAccountConfig)
}

export default putUpdateAccountRequest
