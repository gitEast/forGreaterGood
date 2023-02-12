/*
 * @Author: EastWind linxiayoudongfeng@gmail.com
 * @Date: 2023-02-03 19:53:46
 * @LastEditors: EastWind linxiayoudongfeng@gmail.com
 * @LastEditTime: 2023-02-10 21:43:05
 * @FilePath: \code\04-LinkedList\LinkedList.ts
 * @Description: 链表结构
 */
import ILinkedNode from './ILinkedNode';
import ILinkedList from './ILinkedList';

import LinkedNode from './LinkedNode';

class LinkedList<T> implements ILinkedList<T> {
  head: LinkedNode<T> | null = null;
  private length: number = 0;

  append(element: T): boolean {
    try {
      const node = new LinkedNode(element);

      if (!this.head) {
        this.head = node;
      } else {
        let current = this.head;
        while (current.next) {
          current = current.next;
        }
        current.next = node;
      }

      this.length++;
      return true;
    } catch (error) {
      return false;
    }
  }

  insert(position: number, element: T): boolean {
    try {
      /**
       * 1. 越界；
       * 2. 获取当前位置的前一位
       * 3. 插入
       */
      if (position < 0 || position > this.size()) {
        return false;
      }

      const node = new LinkedNode(element);
      if (position === 0) {
        node.next = this.head;
        this.head = node;
      } else {
        const current = this.get(position - 1);
        const nextNode = current!.next;
        current!.next = node;
        node.next = nextNode;
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  get(position: number): LinkedNode<T> | null {
    if (position < 0 || position > this.size()) {
      return null;
    }

    let index = 0;
    let current = this.head;
    while (index < position) {
      current = current!.next;
      index++;
    }
    return current;
  }

  indexOf(element: T): number {
    let index = 0;
    let current = this.head;

    while (current) {
      if (current.value === element) {
        return index;
      }
      current = current.next;
      index++;
    }

    return -1;
  }

  update(position: number, element: T): boolean {
    try {
      if (position < 0 || position > this.size()) {
        return false;
      }

      const current = this.get(position);
      current!.value = element;
    } catch (error) {
      return false;
    }
    return true;
  }

  removeAt(position: number): LinkedNode<T> | null {
    if (position < 0 || position > this.size()) {
      return null;
    }

    let prev: LinkedNode<T> | null = null;
    let current: LinkedNode<T> | null = null;
    if (position === 0) {
      current = this.head;
    } else {
      prev = this.get(position - 1);
      current = prev!.next;
    }
    prev!.next = current!.next;

    return current;
  }

  remove(element: T): LinkedNode<T> | null {
    const index = this.indexOf(element);
    return this.removeAt(index);
  }

  isEmpty(): boolean {
    return this.length === 0;
  }

  size(): number {
    return this.length;
  }

  traverse(): void {
    let resArr: T[] = [];
    let current = this.head;

    while (current) {
      resArr.push(current.value);
      current = current.next;
    }

    console.log(resArr.join('==>'));
  }
}

export default LinkedList;
