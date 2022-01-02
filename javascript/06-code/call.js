/*
 * @Author: East
 * @Date: 2022-01-01 19:20:47
 * @LastEditTime: 2022-01-01 19:36:10
 * @LastEditors: Please set LastEditors
 * @Description: call 函数手写
 * @FilePath: \forGreaterGood\javascript\06-code\call.js
 */
Function.prototype.myCall = function (thisArg, ...rest) {
  var fn = this;
  var realThis = thisArg ? Object(thisArg) : globalThis;
  realThis.fn = fn;
  var result = realThis.fn(...rest);
  delete realThis.fn;
  return result;
};

function sum(num1, num2) {
  console.log(`${num1} + ${num2} = ${num1 + num2}`, this);
  return num1 + num2;
}

console.log(sum.call("abc", 2, 4));
console.log(sum.call(undefined, 2, 4));
console.log("-------------------分割线-------------------");
console.log(sum.myCall("abc", 2, 4));
console.log(sum.myCall(undefined, 2, 4));
