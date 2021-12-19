/*
 * @Author: East
 * @Date: 2021-12-19 19:16:54
 * @LastEditTime: 2021-12-19 19:33:50
 * @LastEditors: Please set LastEditors
 * @Description: 双向链表
 * @FilePath: \forGreaterGood\algorithm\05-code\doublyLinkedList.js
 */
function DoublyLinkedList() {
  // 本身的属性
  this.head = null;
  this.tail = null;
  this.length = 0;

  // 内部类：节点类
  function Node(data) {
    this.prev = null;
    this.data = data;
    this.next = null;
  }

  /* 常见操作 */
  DoublyLinkedList.prototype.isEmpty = function () {
    return this.length === 0;
  };

  DoublyLinkedList.prototype.size = function () {
    return this.length;
  };

  DoublyLinkedList.prototype.append = function (data) {
    const node = new Node(data);

    if (this.isEmpty()) {
      this.head = node;
      node.prev = this.head;
      node.next = this.tail;
    } else {
      let current = this.head;
      while (current.next) {
        current = current.next;
      }
      current.next = node;
      node.prev = current;
      node.next = this.tail;
    }

    this.length += 1;
  };

  DoublyLinkedList.prototype.insert = function (position, data) {
    if (position < 0 || position > this.length) {
      console.log("下标越界啦");
      return;
    }
    const data = new Node(data);
    if (position === 0) {
      this.head = node;
      node.prev = this.head;
      node.next = this.tail;
    } else {
      let index = 0;
      let prev = null;
      let current = this.head;
      while (index < position) {
        prev = current;
        current = current.next;
        index += 1;
      }
      prev.next = node;
      node.prev = prev;
      node.next = current;
      current.prev = node;
    }

    this.length += 1;
  };
}
