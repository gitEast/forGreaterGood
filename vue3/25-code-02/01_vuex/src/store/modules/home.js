/*
 * @Author: your name
 * @Date: 2021-11-21 14:13:21
 * @LastEditTime: 2021-11-21 14:23:40
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \forGreaterGood\vue3\25-code-02\01_vuex\src\store\modules\home.js
 */
const homeModule = {
  state() {
    return {
      homeCounter: 100,
    };
  },
  getters: {
    doubleHomeCounter(state) {
      return state.homeCounter * 2;
    },
  },
  mutations: {
    increment(state) {
      state.homeCounter++;
    },
  },
  actions: {},
};

export default homeModule;
