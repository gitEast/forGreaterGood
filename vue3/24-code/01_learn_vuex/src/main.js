/*
 * @Author: your name
 * @Date: 2021-11-16 09:59:56
 * @LastEditTime: 2021-11-16 14:18:33
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \forGreaterGood\vue3\24-code\01_learn_vuex\src\main.js
 */
import { createApp } from 'vue'
// import App from './App.vue'
import App from './AppUseHooks.vue'
import store from './store'

const app = createApp(App)
app.use(store)
app.mount('#app')
