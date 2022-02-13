/*
 * @Author: East
 * @Date: 2022-02-14 06:25:16
 * @LastEditTime: 2022-02-14 06:35:54
 * @LastEditors: Please set LastEditors
 * @Description: 双向链表的 ES6 写法
 * @FilePath: \forGreaterGood\algorithm\05-code\es6\doublyLinkedList.js
 */
const { Node, LinkedList } = require("./linkedList");

/* 双向节点 */
class DoublyNode extends Node {
  constructor(element) {
    super(element);
    this.prev = null;
  }
}

/* 双向链表 */
class DoublyLinkedList extends LinkedList {
  constructor() {
    super();
    this.tail = null;
  }
  // 3.1 append(data)
  // 3.2 insert(position, data)
  // 3.3 get(position)
  // 3.4 indexOf(data)
  // 3.5 update(position, data)
  // 3.6 removeAt(position)
  // 3.7 remove(data)
  // 3.8 isEmpty()
  // 3.9 size()
  // 3.10 toString()
  // 3.11 forwardString() --- 返回正向遍历的节点字符串形式
  // 3.12 backwordString() --- 返回反向遍历的节点字符串形式
}
