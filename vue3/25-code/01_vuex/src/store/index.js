/*
 * @Author: your name
 * @Date: 2021-11-19 10:44:41
 * @LastEditTime: 2021-11-19 11:19:40
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \forGreaterGood\vue3\25-code\01_vuex\src\store\index.js
 */
import { createStore } from 'vuex'

const store = createStore({
  state() {
    return {
      counter: 100
    }
  },
  getters: {},
  mutations: {
    increment(state) {
      state.counter++
    },
    decrement(state) {
      state.counter--
    },
    incrementN(state, payload) {
      state.counter += payload.num
    }
  },
  actions: {
    incrementAtion(context) {
      context.commit('increment')
    }
  } 
})

export default store
