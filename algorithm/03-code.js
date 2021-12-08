/*
 * @Author: East
 * @Date: 2021-12-08 01:45:00
 * @LastEditTime: 2021-12-08 01:58:11
 * @LastEditors: Please set LastEditors
 * @Description: 使用数组实现栈结构
 * @FilePath: \forGreaterGood\algorithm\03-code.js
 */
class Stack {
  stack;

  constructor() {
    this.stack = [];
  }

  // 入栈
  push(item) {
    this.stack.push(item);
  }

  // 出栈
  unstack() {
    return this.stack.pop();
  }

  // 返回栈顶元素
  peek() {
    return this.stack[this.stack.length - 1];
  }

  isEmpty() {
    if (this.stack.length === 0) {
      return true;
    }
    return false;
  }

  size() {
    return this.stack.length;
  }

  toString() {
    return this.stack.join(" ");
  }
}

const stack = new Stack();
stack.push(111);
stack.push(222);
stack.push(333);

console.log(stack.unstack());
