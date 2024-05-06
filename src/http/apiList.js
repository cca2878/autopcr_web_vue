// api.js
const appBase = import.meta.env.BASE_URL
const apiBase = 'api'

function prependAddressBase(obj) {
  const addressBase = ``
  if (Object.prototype.hasOwnProperty.call(obj, 'address')) {
    obj.address = addressBase + obj.address
    return obj
  } else {
    return obj
  }
}

const apiList = {
  baseURL: `${appBase}${apiBase}`,
  salt: (pwd) => `Dd#6et%vGeB7${pwd}OQ$&kLO#uv~p`,
  postQQLogin: () =>
    prependAddressBase({
      address: `/login/qq`,
      method: 'post'
    }),
  postRegister: () =>
    prependAddressBase({
      address: `/register`,
      method: 'post'
    }),
  postLogout: () =>
    prependAddressBase({
      address: `/logout`,
      method: 'post'
    }),
  postValidate: () =>
    prependAddressBase({
      address: `/validate`,
      method: 'post'
    }),
  getQueryValidate: (acc) =>
    prependAddressBase({
      address: `/account/${acc}/query_validate`,
      method: 'get'
    }),
  getSingleResult: (acc, order) =>
    prependAddressBase({
      address: `/account/${acc}/single_result/${order}`,
      method: 'get'
    }),
  postDoSingle: (acc) =>
    prependAddressBase({
      address: `/account/${acc}/do_single`,
      method: 'post'
    }),
  getGetDailyResult: (acc, result_id) =>
    prependAddressBase({
      address: `/account/${acc}/daily_result/${result_id}`,
      method: 'get'
    }),
  getGetToolsResult: (acc) =>
    prependAddressBase({
      address: `/account/${acc}/tools_result`,
      method: 'get'
    }),
  postDoDaily: (acc) =>
    prependAddressBase({
      address: `/account/${acc}/do_daily`,
      method: 'post'
    }),
  // 设置配置项值
  putPutConfig: (acc) =>
    prependAddressBase({
      address: `/account/${acc}/config`,
      method: 'put'
    }),
  // 获取该账户所有工具配置
  getGetToolsConfig: (acc) =>
    prependAddressBase({
      address: `/account/${acc}/tools`,
      method: 'get'
    }),
  // 获取该账户所有清日常配置
  getGetDailyConfig: (acc) =>
    prependAddressBase({
      address: `/account/${acc}/daily`,
      method: 'get'
    }),
  // 更新账户信息
  putUpdateAccount: (acc) =>
    prependAddressBase({
      address: `/account/${acc}`,
      method: 'put'
    }),
  // 删除日常账户
  deleteUpdateAccount: (acc) =>
    prependAddressBase({
      address: `/account/${acc}`,
      method: 'delete'
    }),
  // 获取单个账户详细信息
  getGetAccount: (acc) =>
    prependAddressBase({
      address: `/account/${acc}`,
      method: 'get'
    }),
  /* 同步配置。
        data格式：
        {alias: "source acc",
        target: ['target acc Array']}
        target可空，为空则同步到所有账户
        * */
  postSyncAccountConfig: () =>
    prependAddressBase({
      address: `/account/sync`,
      method: 'post'
    }),

  /*添加清日常账户。
        data格式：
        {"alias": "accname",}
        * */
  postCreateAccount: () =>
    prependAddressBase({
      address: `/account`,
      method: 'post'
    }),

  /*设置默认日常账户。
   * data格式：
   * {"default_account": "accname",}
   * */
  putPutDefaultAccount: () =>
    prependAddressBase({
      address: `/account`,
      method: 'put'
    }),
  getGetInfo: () =>
    prependAddressBase({
      address: `/account`,
      method: 'get'
    }),
  // 更改用户资料
  postModifyProfile: () =>
    prependAddressBase({
      address: `/modify_profile`,
      method: 'post'
    })
}
export default apiList
