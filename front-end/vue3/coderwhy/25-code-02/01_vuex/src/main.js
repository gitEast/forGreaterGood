/*
 * @Author: your name
 * @Date: 2021-11-21 11:44:26
 * @LastEditTime: 2021-11-21 14:18:03
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \forGreaterGood\vue3\25-code-02\01_vuex\src\main.js
 */
import { createApp } from "vue";
// import App from "./App.vue";
import App from "./App-root.vue";

// import store from "./store";
import store from "./store/index-root";

const app = createApp(App);
app.use(store);
app.mount("#app");
