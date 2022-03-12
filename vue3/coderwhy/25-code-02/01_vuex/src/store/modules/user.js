/*
 * @Author: your name
 * @Date: 2021-11-21 14:13:25
 * @LastEditTime: 2021-11-21 14:35:16
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \forGreaterGood\vue3\25-code-02\01_vuex\src\store\modules\user.js
 */
const userModule = {
  namespaced: true,
  state() {
    return {
      userCounter: 10,
    };
  },
  getters: {
    doubleUserCounter(state) {
      return state.userCounter * 2;
    },
  },
  mutations: {
    increment(state) {
      state.userCounter++;
    },
  },
  actions: {},
};

export default userModule;
