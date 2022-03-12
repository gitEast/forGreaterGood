/*
 * @Author: your name
 * @Date: 2021-11-13 17:12:09
 * @LastEditTime: 2021-11-13 17:49:57
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \forGreaterGood\vue3\18-code\01_vue3_add\src\main.js
 */
import { createApp } from 'vue'
// import App from './默认实现.vue'
// import App from './局部指令.vue'
import App from './全局指令.vue'

const app = createApp(App)
app.directive('focus', {
  mounted(el, bindings, vnode, preVnode) {
    el.focus()
  }
})
app.mount('#app')
