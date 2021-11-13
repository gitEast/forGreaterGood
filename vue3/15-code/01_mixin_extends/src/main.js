/*
 * @Author: your name
 * @Date: 2021-11-12 13:37:48
 * @LastEditTime: 2021-11-12 13:50:01
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \forGreaterGood\vue3\15-code\01_mixin_extends\src\main.js
 */
import { createApp } from 'vue'
import App from './App.vue'
import { globalMixin } from './mixins/globalMixin'

const app = createApp(App)
app.mixin(globalMixin)
app.mount('#app')
