import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/styles/border.css'
import '@/assets/styles/reset.css'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 国际化中文
import zhCn from 'element-plus/es/locale/lang/zh-cn'

import '@/router/permission'


import SvgIcon from '@/icons'
const app=createApp(App)

SvgIcon(app);
app.use(store).use(router)
    .use(ElementPlus,{locale: zhCn,})
    .mount('#app')



