/*
 * @Author: your name
 * @Date: 2021-11-16 10:00:48
 * @LastEditTime: 2021-11-16 14:49:46
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \forGreaterGood\vue3\24-code\01_learn_vuex\src\store\index.js
 */
import { createStore } from 'vuex'

const store = createStore({
  state() {
    return {
      name: 'why',
      age: 18,
      counter: 100,
      books: [
        { name: '111', price: 111 },
        { name: '222', price: 222 },
        { name: '333', price: 333 },
        { name: '444', price: 555 },
      ]
    }
  },
  mutations: {},
  getters: {
    totalPrice(state, getters) {
      return getters.currentDiscount * state.books.reduce((prev, item) =>  prev + item.price, 0)
    },
    currentDiscount() {
      return 0.9
    },
    nameInfo(state) {
      return `name: ${state.name}`
    },
    ageInfo(state) {
      return `age: ${state.age}`
    },
    counterInfo(state) {
      return `counter: ${state.counter}`
    }
  }
})

export default store
