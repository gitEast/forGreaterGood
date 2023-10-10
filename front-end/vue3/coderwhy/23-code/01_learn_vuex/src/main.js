/*
 * @Author: your name
 * @Date: 2021-11-16 09:30:12
 * @LastEditTime: 2021-11-16 09:48:43
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \forGreaterGood\vue3\23-code\01_learn_vuex\src\main.js
 */
import { createApp } from 'vue'
import App from './App.vue'
import store from './store'

const app = createApp(App)
app.use(store)
app.mount('#app')
