/*
 * @Author: East
 * @Date: 2022-01-03 13:30:24
 * @LastEditTime: 2022-01-03 13:44:04
 * @LastEditors: Please set LastEditors
 * @Description: 手写组合函数
 * @FilePath: \forGreaterGood\javascript\07-code\compose.js
 */
function double(num) {
  return num * 2;
}
function square(num) {
  return num * num;
}

function myCompose(...fns) {
  const fnsLength = fns.length;
  if (!fnsLength) {
    throw new Error("没有函数传进来，我很难办事啊");
  }
  for (let i = 0; i < fns.length; i++) {
    if (typeof fns[i] !== "function") {
      throw new TypeError("参数应该是函数啊宝");
    }
  }

  // 开始进入正题
  return function compose(...args) {
    let result = fns[0].apply(this, args);
    for (let i = 1; i < fns.length; i++) {
      result = fns[i].call(this, result);
    }
    return result;
  };
}

console.log(square(double(3)));
const compose = myCompose(double, square);
console.log(compose(3));
