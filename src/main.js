import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/styles/border.css'
import '@/assets/styles/reset.css'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import '@/router/permission'


import SvgIcon from '@/icons'
const app=createApp(App)

SvgIcon(app);

app.use(store).use(router).use(ElementPlus).mount('#app')



