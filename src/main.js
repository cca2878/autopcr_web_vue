import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/dark/css-vars.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.mount('#app')
