/*
 * @Author: East
 * @Date: 2021-12-19 17:51:50
 * @LastEditTime: 2022-02-14 06:06:29
 * @LastEditors: Please set LastEditors
 * @Description: 链表实现
 * @FilePath: \forGreaterGood\algorithm\05-code\linkedList.js
 */
function LinkedList() {
  this.header = null;
  this.length = 0;

  // 新节点
  function Node(data) {
    this.data = data;
    this.next = null;
  }

  LinkedList.prototype.append = function (data) {
    const node = new Node(data);

    if (this.isEmpty()) {
      this.header = node;
    } else {
      let current = this.header;
      while (current.next) {
        current = current.next;
      }
      current.next = node;
    }

    this.length += 1;
  };

  LinkedList.prototype.insert = function (position, data) {
    if (position < 0 || position > this.length) {
      console.log("position 越界啦");
      return;
    }

    const node = new Node(data);
    let current = this.header;
    if (position === 0) {
      this.header = node;
      node.next = current;
    } else {
      let index = 0;
      let previous = null;
      while (index < position) {
        previous = current;
        current = current.next;
        index += 1;
      }
      previous.next = node;
      node.next = current;
    }

    this.length += 1;
  };
  LinkedList.prototype.get = function (position) {
    if (position < 0 || position > this.length) {
      console.log("position 越界啦");
      return;
    }

    let index = 0;
    let current = this.header;
    while (index < position) {
      current = current.next;
      index += 1;
    }

    return current.data;
  };
  LinkedList.prototype.indexOf = function (data) {
    if (this.isEmpty()) {
      console.log("这个链表是空的，别白费劲啦");
      return -1;
    }
    let index = 0;
    let current = this.header;

    while (current) {
      if (current.data === data) {
        return index;
      }
      index += 1;
      current = current.next;
    }
    return -1;
  };
  LinkedList.prototype.update = function (position, data) {
    if (position < 0 || position > this.length) {
      console.log("position 越界啦");
      return;
    }

    let index = 0;
    let current = this.header;
    while (index < position) {
      current = current.next;
      index += 1;
    }
    current.data = data;
  };
  LinkedList.prototype.removeAt = function (position) {
    if (position < 0 || position > this.length) {
      console.log("position 越界啦");
      return;
    }

    let index = 0;
    let current = this.header;
    let previous = null;
    while (index < position) {
      previous = current;
      current = current.next;
      index += 1;
    }
    previous.next = current.next;
    this.length -= 1;
  };
  LinkedList.prototype.remove = function (data) {
    const position = this.indexOf(data);
    this.removeAt(position);
  };
  LinkedList.prototype.isEmpty = function () {
    return this.length === 0;
  };
  LinkedList.prototype.size = function () {
    return this.length;
  };
  LinkedList.prototype.toString = function () {
    if (this.isEmpty()) {
      return "";
    }
    let current = this.header;
    let linkedListStr = current.data;

    while (current.next) {
      current = current.next;
      linkedListStr += " " + current.data;
    }

    return linkedListStr;
  };
}

// 开始测试
const linkedList = new LinkedList();
// console.log(linkedList.isEmpty());
// console.log(linkedList.toString());
// console.log(linkedList.size());
linkedList.append("111");
// console.log(linkedList.isEmpty());
// console.log(linkedList.toString());
// console.log(linkedList.size());
linkedList.insert(0, "000");
linkedList.insert(1, "001");
linkedList.insert(3, "333");
// console.log(linkedList.toString());
// console.log(linkedList.size());
// console.log("-------------------------------");
// console.log(linkedList.get(1));
// console.log(linkedList.get(2));
// console.log(linkedList.indexOf(2));
// console.log(linkedList.indexOf("111"));
// console.log(linkedList.toString());
linkedList.update(2, "222");
// console.log(linkedList.toString());
// console.log(linkedList.size());
linkedList.removeAt(2);
// console.log(linkedList.toString());
linkedList.remove("222");
console.log(linkedList.size());
console.log(linkedList.toString());
console.log(linkedList.size());
console.log("---------------------");
linkedList.remove("333");
console.log(linkedList.toString());
console.log(linkedList.size());
