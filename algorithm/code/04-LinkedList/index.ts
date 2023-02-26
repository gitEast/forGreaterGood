import ILinkedList from './ILinkedList';
import Node from './Node';

class LinkedList<T> implements ILinkedList<T> {
  private head: Node<T> | null = null;
  private length: number = 0;

  private getNode(position: number): Node<T> | null {
    /* 不做越界判断，默认在界内 */
    let current: Node<T> | null = this.head;
    let index = 0;

    while (index++ < position) {
      current = current!.next;
    }

    return current;
  }

  append(element: T): void {
    /**
     * 分情况：
     *   1. head 为空
     *   2. head 不为空
     */
    const node = new Node(element);
    if (!this.head) {
      this.head = node;
    } else {
      let current: Node<T> = this.head;

      while (current.next) {
        current = current.next;
      }

      current.next = node;
    }

    this.length++;
  }

  insert(position: number, element: T): boolean {
    /**
     * 分情况：
     *   1. 越界
     *   2. position 为 0
     *   3. position 不为 0
     */
    if (position < 0 || position > this.length) {
      return false;
    }

    const node = new Node(element);
    if (position === 0) {
      node.next = this.head;
      this.head = node;
    } else {
      let previous = this.getNode(position - 1)!;
      node.next = previous.next;
      previous.next = node;
    }

    this.length++;

    return true;
  }

  removeAt(position: number): T | null {
    /**
     * 分情况：
     *   1. 越界
     *   2. position === 0
     *   3. position !== 0
     */
    if (position < 0 || position >= this.length) {
      return null;
    }

    let current: Node<T> | null = this.head;
    if (position === 0) {
      this.head = this.head!.next;
    } else {
      let previous = this.getNode(position - 1)!;
      current = previous.next;

      previous!.next = current!.next;
    }

    this.length--;

    return current?.value ?? null;
  }

  get(position: number): T | null {
    /**
     * 分情况：
     *   1. 越界
     *   2. 正常
     */
    if (position < 0 || position >= this.length) {
      return null;
    }

    let current = this.getNode(position);

    return current?.value ?? null;
  }

  update(position: number, element: T): boolean {
    if (position < 0 || position >= this.length) {
      return false;
    }

    const current = this.getNode(position)!;
    current.value = element;
    return true;
  }

  indexOf(element: T): number {
    let current: Node<T> | null = this.head;
    let index = 0;

    while (index < this.length) {
      if (current!.value === element) {
        return index;
      }
      current = current!.next;
      index++;
    }

    return -1;
  }

  remove(element: T): T | null {
    const position = this.indexOf(element);
    return this.removeAt(position);
  }

  isEmpty(): boolean {
    return this.head === null;
  }
  size(): number {
    return this.length;
  }

  traverse() {
    let current: Node<T> | null = this.head;
    const list: T[] = [];

    while (current) {
      list.push(current.value);
      current = current.next;
    }

    console.log('traverse:', list.join('==>'));
  }
}

export default LinkedList;
