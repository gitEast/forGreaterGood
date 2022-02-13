/*
 * @Author: East
 * @Date: 2022-02-14 05:59:22
 * @LastEditTime: 2022-02-14 06:34:03
 * @LastEditors: Please set LastEditors
 * @Description: ES6 的实现
 * @FilePath: \forGreaterGood\algorithm\05-code\es6\linkedList.js
 */
/* 节点类 */
class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

/* 单向链表 */
class LinkedList {
  constructor() {
    this.head = null;
    this.length = 0;
  }

  append(data) {
    // 1. 创建新节点
    const node = new Node(data);
    // 2. 添加节点：if 第一个节点
    if (this.length === 0) {
      this.head = node;
    } else {
      let nowNode = this.head;
      while (nowNode.next) {
        nowNode = nowNode.next;
      }
      nowNode.next = node;
    }
    // 3. 长度 +1
    this.length++;
  }

  insert(position, data) {
    // 1. 判断 position 是否过界
    if (position < 0 || position > this.length) {
      console.log("position 越界啦！");
      return;
    }
    // 2. 创建新节点
    const node = new Node(data);
    // 3. 插入：if position = 0
    if (position === 0) {
      const nowNode = this.head;
      this.head = node;
      node.next = nowNode;
    } else {
      let length = 0;
      let prevNode = null;
      let nowNode = this.head;
      while (length++ < position) {
        prevNode = nowNode;
        nowNode = nowNode.next;
      }
      prevNode.next = node;
      node.next = nowNode;
    }
    // 4. 长度 +1
    this.length++;
  }

  get(position) {
    // 1. 判断 position 是否过界
    if (position < 0 || position > this.length) {
      console.log("position 越界啦！");
      return;
    }
    // 2. 获取值
    let length = 0;
    let nowNode = this.head;
    while (length++ < position) {
      nowNode = nowNode.next;
    }
    return nowNode.data;
  }

  indexOf(data) {
    let length = 0;
    let nowNode = this.head;

    while (length < this.length) {
      if (nowNode.data === data) {
        break;
      }
      nowNode = nowNode.next;
      length++;
    }
    return length;
  }

  isEmpty() {
    return this.length === 0;
  }

  size() {
    return this.length;
  }

  toString() {
    let nowNode = this.head;
    let str = nowNode.data;
    while (nowNode.next) {
      nowNode = nowNode.next;
      str += ", " + nowNode.data;
    }
    return str;
  }
}

// const linkedList = new LinkedList();
// linkedList.append("111");
// linkedList.insert(0, "000");
// linkedList.insert(1, "001");
// linkedList.insert(3, "333");
// console.log(linkedList.toString());

module.exports = { Node, LinkedList };
