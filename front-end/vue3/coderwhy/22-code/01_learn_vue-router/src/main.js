/*
 * @Author: your name
 * @Date: 2021-11-15 11:08:19
 * @LastEditTime: 2021-11-15 11:20:11
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \forGreaterGood\vue3\22-code\01_learn_vue-router\src\main.js
 */
import { createApp } from 'vue'

import router from './router'
import App from './App.vue'

const app = createApp(App)
app.use(router)
app.mount('#app')
