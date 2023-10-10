/*
 * @Author: your name
 * @Date: 2021-11-14 11:34:54
 * @LastEditTime: 2021-11-14 12:25:18
 * @LastEditors: Please set LastEditors
 * @Description: 响应式系统
 * @FilePath: \vue3\18-code\05_reactive_module\reactive.js
 */
const info = { counter: 100 };

function doubleCounter() {
  console.log(info.counter * 2);
}

doubleCounter();

const targetMap = new WeakMap();
function getDep(target, key) {}

// 数据劫持
function reactive(raw) {
  Object.keys(raw).forEach((key) => {
    Object.defineProperties(raw, key, {
      get() {},
      set() {},
    });
  });
}
