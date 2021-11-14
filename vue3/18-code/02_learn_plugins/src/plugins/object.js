/*
 * @Author: your name
 * @Date: 2021-11-14 09:06:35
 * @LastEditTime: 2021-11-14 09:18:16
 * @LastEditors: Please set LastEditors
 * @Description: 对象形式
 * @FilePath: \vue3\18-code\02_learn_plugins\src\plugins\object.js
 */
export default {
  install(app) {
    app.config.globalProperties.name = "coderwhy";
  },
};
