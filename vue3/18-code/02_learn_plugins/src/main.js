/*
 * @Author: your name
 * @Date: 2021-11-13 22:04:38
 * @LastEditTime: 2021-11-14 09:16:53
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \vue3\18-code\02_learn_plugins\src\main.js
 */
import { createApp } from "vue";
import App from "./App.vue";

import PluginObject from "./plugins/object";
import PluginFunction from "./plugins/function";

const app = createApp(App);

app.use(PluginObject);
app.use(PluginFunction);

app.mount("#app");
