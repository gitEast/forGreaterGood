/*
 * @Author: East
 * @Date: 2021-12-15 21:35:58
 * @LastEditTime: 2021-12-15 22:19:05
 * @LastEditors: Please set LastEditors
 * @Description: 击鼓传花
 * @FilePath: \forGreaterGood\algorithm\04-code\case01.js
 */
class Queue {
  constructor() {
    this.items = [];
  }
}

// 进入队列 by 最后
Queue.prototype.enqueue = function (item) {
  this.items.push(item);
};

// 出列 by 最先
Queue.prototype.dequeue = function () {
  return this.items.shift();
};

Queue.prototype.size = function () {
  return this.items.length;
};

// const friends = [
//   { name: "east", index: 1 },
//   { name: "wind", index: 2 },
//   { name: "code", index: 3 },
//   { name: "know", index: 4 },
//   { name: "hello", index: 5 },
//   { name: "linda", index: 6 },
// ];

function game(nameList, num) {
  const queue = new Queue();

  nameList.forEach((name, index) => {
    queue.enqueue({
      name: name,
      index: index,
    });
  });

  for (let index = 0; index < num; index++) {
    const item = queue.dequeue();
    if (index !== 4) {
      queue.enqueue(item);
    } else {
      index = 0;
    }
    if (queue.size() === 1) {
      break;
    }
  }

  return queue.dequeue();
}

console.log(game(["east", "wind", "code", "know", "hello"], 3));
