/*
 * @Author: your name
 * @Date: 2021-11-21 11:51:12
 * @LastEditTime: 2021-11-21 14:16:35
 * @LastEditors: Please set LastEditors
 * @Description: vuex 的使用
 * @FilePath: \forGreaterGood\vue3\25-code-02\01_vuex\src\store\index.js
 */
import { createStore } from "vuex";
import axios from "axios";

import homeModule from "./modules/home";
import userModule from "./modules/user";

const store = createStore({
  state() {
    return {
      rootCounter: 0,
    };
  },
  mutations: {
    increment(state) {
      state.rootCounter++;
    },
  },
  actions: {
    incrementAction(context, payload) {
      console.log(payload);
      context.commit("increment");
    },
  },
  modules: {
    home: homeModule,
    user: userModule,
  },
});

export default store;
