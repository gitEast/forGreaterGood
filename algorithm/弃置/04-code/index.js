/*
 * @Author: East
 * @Date: 2021-12-15 21:16:14
 * @LastEditTime: 2021-12-15 21:20:05
 * @LastEditors: Please set LastEditors
 * @Description: 实现队列
 * @FilePath: \forGreaterGood\algorithm\04-code\index.js
 */
function Queue() {
  this.items = [];

  Queue.prototype.enqueue = function (item) {
    this.items.push(item);
  };

  Queue.prototype.dequeue = function () {
    return this.items.shift();
  };

  Queue.prototype.front = function () {
    return this.items[0];
  };

  Queue.prototype.isEmpty = function () {
    return this.items.length === 0;
  };

  Queue.prototype.size = function () {
    return this.items.length;
  };

  Queue.prototype.toString = function () {
    return this.items.join(" ");
  };
}

const queue = new Queue();
queue.enqueue(1);
queue.enqueue(2);
queue.enqueue(3);
console.log(queue.front());
