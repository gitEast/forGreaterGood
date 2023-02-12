/*
 * @Author: East
 * @Date: 2022-02-14 06:25:16
 * @LastEditTime: 2022-02-22 21:30:22
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
  append(element) {
    // a. 新建元素
    const newNode = new DoublyNode(element);

    // b. 判断是否为空
    if (this.length === 0) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      newNode.prev = this.tail;
      this.tail = newNode;
    }

    // c. 长度 + 1
    this.length++;
  }

  // 3.2 insert(position, data)
  insert(position, element) {
    // a. 越界判断

    // b. 创建新节点
    const newNode = new DoublyNode(element);

    // c. 判断插入位置 —— 头部，中间，尾部
    if (position === 0) {
      // c.1 判断是空着插入，还是双向链表中有值插入
    } else if (position === this.length) {
    } else {
      let index = 0;
      let current = this.head;
      while (index++ < position) {
        current = current.next;
      }
      const prev = current.prev;
      prev.next = newNode;
      newNode.prev = prev;
      newNode.next = current;
      current.prev = newNode;
    }

    // d. 长度 + 1
  }

  // 3.3 get(position) -- 使用继承的 get 方法即可

  // 3.4 indexOf(data) -- 继承

  // 3.5 update(position, data)
  update(position, element) {
    const result = this.removeAt(position);
    this.insert(position, element);
    return result;
  }

  // 3.6 removeAt(position)
  removeAt(position) {
    // a. 越界判断

    // b. 情况分析
    let current = this.head;
    if (position === 0) {
      // b.1 判断只有一个元素删除 or 多个元素
      if (this.length === 1) {
        this.head = null;
        this.tail = null;
      } else {
        this.head = this.head.next;
        this.head.prev = null;
      }
    } else if (position === this.length) {
      // b.2 删除最后一个元素
      current = this.tail;
      this.tail = this.tail.prev;
      this.tail.next = null;
    } else {
    }

    this.length--;

    return current.element;
  }

  // 3.7 remove(data)
  // 3.8 isEmpty()
  // 3.9 size()
  // 3.10 toString()
  // 3.11 forwardString() --- 返回正向遍历的节点字符串形式
  // 3.12 backwordString() --- 返回反向遍历的节点字符串形式
}
