/*
 * @Author: your name
 * @Date: 2021-11-21 11:51:12
 * @LastEditTime: 2021-11-21 14:16:12
 * @LastEditors: Please set LastEditors
 * @Description: vuex 的使用
 * @FilePath: \forGreaterGood\vue3\25-code-02\01_vuex\src\store\index.js
 */
import { createStore } from "vuex";
import axios from "axios";

const store = createStore({
  state() {
    return {
      name: "East",
      age: 22,
      counter: 0,
      banners: [],
    };
  },
  mutations: {
    increment(state) {
      state.counter++;
    },
    addBannerData(state, payload) {
      state.banners = payload;
    },
  },
  actions: {
    incrementAction(context, payload) {
      console.log(payload);
      context.commit("increment");
    },
    getHomeMultiData(context) {
      axios.get("http://123.207.32.32:8000/home/multidata").then((res) => {
        console.log(res);
        context.commit("addBannerData", res.data.data.banner.list);
      });
    },
  },
});

export default store;
