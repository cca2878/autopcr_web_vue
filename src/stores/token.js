// import {useSessionStorage, useStorage} from "@vueuse/core";
// import {watchEffect} from "vue";
//
//
// // 从localStorage中获取token。
// const tokenDefault = JSON.stringify({access_token: '', refresh_token: '', token_type: ''})
// const sessionToken = useStorage('session_token', tokenDefault, sessionStorage)
// const localToken = useStorage('local_token', tokenDefault, localStorage)
// const sessionAutoLogin = useSessionStorage('session_autoLogin', false)
// watchEffect(() => {
//     sessionToken.value = localToken.value
// })
//
// // 刷新token，根据是否自动登录选择存储。autoLogin可选，设置状态，默认false
// export function setToken(token = undefined, autoLogin = false) {
//     sessionAutoLogin.value = autoLogin
//     if (token === undefined) {
//         token = tokenDefault
//     } else {
//         token = JSON.stringify(token)
//     }
//     if (autoLogin) {
//         localToken.value = token
//     } else {
//         sessionToken.value = token
//     }
// }
//
// export function getToken() {
//     return true
//     // return JSON.parse(sessionToken.value)
// }
