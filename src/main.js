import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/styles/border.css'
import '@/assets/styles/reset.css'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 一个用户图像+密码锁图标
// import * as ElementPlusIconsVue from "@element-plus/icons-vue";
// import * as ElIconModules from "@element-plus/icons-vue";


import SvgIcon from '@/icons'
const app=createApp(App)

SvgIcon(app);
// for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
//     app.component(key, component)
// }

app.use(store).use(router).use(ElementPlus).mount('#app')
// Object.keys(ElIconModules).forEach(function (key) {
//     app.component(ElIconModules[key].name, ElIconModules[key])
// })
// app.mount('#app')


