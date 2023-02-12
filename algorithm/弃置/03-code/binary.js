/*
 * @Author: East
 * @Date: 2021-12-09 00:49:52
 * @LastEditTime: 2021-12-09 01:02:00
 * @LastEditors: Please set LastEditors
 * @Description: 十进制 转 二进制
 * @FilePath: \forGreaterGood\algorithm\03-code\binary.js
 */
/** 前提准备：实现栈结构 */
function Stack() {
  this.stack = [];

  Stack.prototype.push = function (item) {
    this.stack.push(item);
  };

  Stack.prototype.pop = function () {
    return this.stack.pop();
  };

  Stack.prototype.peek = function () {
    return this.stack[this.stack.length - 1];
  };

  Stack.prototype.isEmpty = function () {
    return this.stack.length === 0;
  };

  Stack.prototype.size = function () {
    return this.stack.length;
  };

  Stack.prototype.toString = function () {
    return this.stack.join(" ");
  };
}

/** 十进制 转 二进制 */
function decToBin(decNumber) {
  const stack = new Stack();

  // 1. 循环入栈
  while (decNumber) {
    stack.push(decNumber % 2);
    decNumber = Math.floor(decNumber / 2);
  }

  // 2. 出栈
  let binaryString = "";
  while (!stack.isEmpty()) {
    binaryString += stack.pop();
  }

  return binaryString;
}

console.log(decToBin(100));

exports = {};
