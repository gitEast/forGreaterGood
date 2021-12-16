/*
 * @Author: East
 * @Date: 2021-12-16 21:40:51
 * @LastEditTime: 2021-12-16 21:53:47
 * @LastEditors: Please set LastEditors
 * @Description: 优先级队列的实现：数字越小，优先级越高
 * @FilePath: \forGreaterGood\algorithm\04-code\priorityQueue.js
 */
// 优先级队列中的元素
class PriorityElement {
  constructor(element, priority) {
    this.element = element;
    this.priority = priority;
  }
}

// 优先级队列
class PriorityQueue {
  constructor() {
    this.items = [];
  }
}
PriorityQueue.prototype.enqueue = function (element, priority) {
  const priorityEl = new PriorityElement(element, priority);

  /* 开始比较 */
  if (this.isEmpty()) {
    // 如果为空
    this.items.push(priorityEl);
    return;
  }
  // 如果不为空，则需要比较优先级
  let added = false;
  for (let i = 0; i < this.items.length; i++) {
    const item = this.items[i];
    if (priorityEl.priority < item.priority) {
      this.items.splice(i, 0, priorityEl);
      added = true;
      break;
    }
  }
  if (!added) {
    this.items.push(priorityEl);
  }
};
PriorityQueue.prototype.isEmpty = function () {
  return this.items.length === 0;
};

const pq = new PriorityQueue();
pq.enqueue("east", 222);
pq.enqueue("wind", 111);
pq.enqueue("hello", 55);
pq.enqueue("js", 333);
console.log(pq);
