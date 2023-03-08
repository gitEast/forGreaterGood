import { ILinkedList } from '../types';
import Node from './Node';

class LinkedList<T> implements ILinkedList<T> {
  protected head: Node<T> | null = null;
  protected tail: Node<T> | null = null;
  protected length: number = 0;

  protected getNode(position: number): Node<T> | null {
    if (position < 0 || position >= this.length) return null;
    let current: Node<T> = this.head!;
    let index = 0;
    while (index++ < position) {
      current = current.next!;
    }
    return current;
  }

  protected isTail(node: Node<T>): boolean {
    return node === this.tail;
  }

  append(element: T): void {
    const node = new Node(element);
    if (!this.head) {
      this.head = node;
    } else {
      this.tail!.next = node;
    }
    this.tail = node;

    this.length++;
  }

  insert(position: number, element: T): boolean {
    if (position < 0 || position > this.length) return false;

    const node = new Node(element);
    if (position === 0) {
      node.next = this.head;
      this.head = node;
    } else if (position === this.length) {
      this.tail!.next = node;
      this.tail = node;
    } else {
      const prev = this.getNode(position - 1)!;
      node.next = prev.next;
      prev.next = node;
    }
    this.length++;

    return true;
  }

  get(position: number): T | null {
    return this.getNode(position)?.value ?? null;
  }

  indexOf(element: T): number {
    let current: Node<T> | null = this.head;
    let index = 0;
    while (current) {
      if (current.value === element) return index;
      if (this.isTail(current)) break;
      current = current.next;
      index++;
    }
    return -1;
  }

  update(position: number, element: T): boolean {
    const node = this.getNode(position);
    if (!node) return false;
    node.value = element;
    return true;
  }

  removeAt(position: number): T | null {
    if (position < 0 || position >= this.length) return null;

    let current: Node<T> = this.head!;
    if (position === 0) {
      if (this.length === 1) {
        this.head = null;
        this.tail = null;
      } else {
        this.head = this.head!.next;
      }
    } else {
      const prev = this.getNode(position - 1)!;
      current = prev.next!;
      prev.next = prev.next!.next;
      if (this.isTail(current)) {
        this.tail = prev;
      }
    }

    this.length--;

    return current.value;
  }

  remove(element: T): boolean {
    const index = this.indexOf(element);
    return !!this.removeAt(index);
  }

  peek(): T | null {
    return this.head?.value ?? null;
  }

  isEmpty(): boolean {
    return this.length === 0;
  }

  size(): number {
    return this.length;
  }

  traverse() {
    const values: T[] = [];
    let current: Node<T> | null = this.head;
    while (current) {
      values.push(current.value);
      if (this.isTail(current)) break;
      current = current.next;
    }
    if (this.head && this.tail?.next === this.head) {
      values.push(this.head.value);
    }
    console.log(values.join('==>'));
  }
}

export default LinkedList;
