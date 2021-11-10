/*
 * @Author: your name
 * @Date: 2021-11-10 09:31:15
 * @LastEditTime: 2021-11-10 10:22:56
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \forGreaterGood\vue3\10-code\02_vite_demo\src\main.js
 */
// import _ from '../node_modules/lodash-es/lodash.default.js'
import _ from 'lodash-es'
import { createApp } from 'vue'

import { sum } from './js/sum'
import './css/style.css'
import './css/title.less'
import { mul } from './ts/mul'
import App from './vue/app.vue'

console.log(sum(10, 20))

console.log('hello, I am using vite now.')

console.log(_.join(['abc', 'cba'], '_'))

const divEl = document.createElement('div')
divEl.className = 'title'
divEl.innerHTML = 'hello, vite and less'
document.body.appendChild(divEl)

console.log(mul(10, 20))

createApp(App).mount('#app')
