/*
 * @Author: your name
 * @Date: 2021-11-16 09:40:54
 * @LastEditTime: 2021-11-16 09:54:38
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \forGreaterGood\vue3\23-code\01_learn_vuex\src\store\index.js
 */
import { createStore } from 'vuex'

const store = createStore({
  state() {
    return {
      counter: 0
    }
  },
  mutations: {
    increment(state) {
      state.counter++
    },
    decrement(state) {
      state.counter--
    }
  }
})

export default store
