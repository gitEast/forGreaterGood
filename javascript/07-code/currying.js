/*
 * @Author: East
 * @Date: 2022-01-03 13:21:44
 * @LastEditTime: 2022-01-03 13:37:49
 * @LastEditors: Please set LastEditors
 * @Description: 手写柯里化
 * @FilePath: \forGreaterGood\javascript\07-code\currying.js
 */
function foo(x, y, z) {
  return x + y + z;
}

function myCurrying(fn) {
  return function curried(...args) {
    const requiredLength = fn.length;
    const nowLength = args.length;
    if (nowLength >= requiredLength) {
      return fn.call(this, ...args);
    } else {
      return function curriedSecond(...argsSecond) {
        return curried.call(this, ...args, ...argsSecond);
      };
    }
  };
}

const curriedFoo = myCurrying(foo);
console.log(curriedFoo(1, 2, 3));
console.log(curriedFoo(1, 2)(3));
console.log(curriedFoo(1)(2)(3));
console.log(curriedFoo(1, 2, 3, 4));
