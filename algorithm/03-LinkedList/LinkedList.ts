import { ILinkedList, INode } from './type';
import { Node } from './Node';

class LinkedList<T> implements ILinkedList<T> {
  private head: Node<T> | null = null;
  private length: number = 0;

  private getNode(position: number): INode<T> {
    let current = this.head!;
    let index = 0;
    while (index < position) {
      current = current.next!;
      index++;
    }

    return current;
  }

  append(element: T): boolean {
    /**
     * 1. 创建新节点
     * 2. 判断 head 是否为空:
     *    2.1 if 空 -> 直接作为 head;
     *    2.2 if not null -> 遍历直至最后一个节点，该节点的 next 指向新节点
     * 3. length +1
     */
    try {
      const node = new Node(element);

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
    /**
     * 1. 越界判断
     * 2. 创建节点
     * 3. 根据 position 分情况
     *    3.1 position = 0 ==> 在 head 之前，新节点成为新的 head
     *    3.2 position > 0 ==> 遍历直至 position 位置的前一个节点，该节点 next 指向新节点，新节点的 next 指向原 position 位置的节点
     */
    if (position < 0 || position > this.length) return false;

    const node = new Node(element);

    if (position === 0) {
      node.next = this.head;
      this.head = node;
    } else {
      const prev = this.getNode(position - 1);

      node.next = prev.next;
      prev.next = node;
    }

    this.length++;

    return true;
  }

  get(position: number): INode<T> | null {
    /**
     * 1. 越界判断
     * 2. 遍历直至 position 位置
     */
    if (position < 0 || position >= this.length) return null;

    return this.getNode(position);
  }

  indexOf(element: T): number {
    /**
     * 遍历查找
     */
    let current = this.head;
    let index = 0;
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
    /**
     * 1. 越界判断
     * 2. 遍历至 position 位置，将 node 的 value 更新为 element
     */
    if (position < 0 || position >= this.length) return false;

    const current = this.getNode(position);
    current.value = element;

    return true;
  }

  removeAt(position: number): INode<T> | null {
    /**
     * 1. 越界判断
     * 2. 根据 position 分情况:
     *    2.1 if position = 0 ==> head 指向 head.next
     *    2.2 if position > 0 => position-1 位置的 next 指向 position+1 位置的节点
     */
    if (position < 0 || position >= this.length) return null;

    let current = this.head;
    if (position === 0) {
      this.head = this.head!.next;
    } else {
      const prev = this.getNode(position - 1);

      current = prev!.next;
      prev!.next = prev!.next!.next;
    }

    this.length--;

    return current;
  }

  remove(element: T): INode<T> | null {
    const index = this.indexOf(element);
    return this.removeAt(index);
  }

  isEmpty(): boolean {
    return this.length === 0;
  }

  size(): number {
    return this.length;
  }

  // 遍历
  traverse() {
    const arr: T[] = [];
    let current: Node<T> | null = this.head;

    while (current) {
      arr.push(current.value);
      current = current.next;
    }

    console.log(arr.join('==>'));
  }
}

// 测试
const linkedList = new LinkedList<string>();
console.log('------------------------ append ------------------------');
linkedList.append('aaa');
linkedList.traverse();
linkedList.append('bbb');
linkedList.append('ccc');
linkedList.append('ddd');
linkedList.traverse();
console.log(linkedList.size());
console.log('------------------------ insert ------------------------');
linkedList.insert(0, '000');
linkedList.traverse();
console.log(linkedList.size());
linkedList.insert(1, '111');
linkedList.traverse();
console.log(linkedList.size());
linkedList.insert(6, 'eee');
linkedList.traverse();
console.log(linkedList.size());
console.log('------------------------ get ------------------------');
console.log(linkedList.get(0)?.value);
console.log(linkedList.get(1)?.value);
console.log(linkedList.get(6)?.value);
console.log(linkedList.get(7)?.value);
console.log('------------------------ indexOf ------------------------');
console.log(linkedList.indexOf('000'));
console.log(linkedList.indexOf('aaa'));
console.log(linkedList.indexOf('eee'));
linkedList.traverse();
console.log('------------------------ update ------------------------');
linkedList.update(0, '00');
linkedList.update(2, '222');
linkedList.update(-1, '111');
linkedList.traverse();
linkedList.update(0, '000');
linkedList.traverse();
console.log('------------------------ removeAt ------------------------');
console.log(linkedList.removeAt(0)?.value);
linkedList.traverse();
console.log(linkedList.removeAt(1)?.value);
linkedList.traverse();
console.log(linkedList.removeAt(2)?.value);
console.log(linkedList.removeAt(5)?.value);
linkedList.traverse();
console.log(linkedList.size());
console.log('------------------------ remove ------------------------');
console.log(linkedList.remove('111')?.value);
console.log(linkedList.remove('eee')?.value);
console.log(linkedList.remove('aaa')?.value);
linkedList.traverse();
console.log(linkedList.size());
