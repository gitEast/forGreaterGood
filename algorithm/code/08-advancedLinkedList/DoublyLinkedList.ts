import DoublyNode from './DoublyNode';
import LinkedList from './LinkedList';

class DoublyLinkedList<T> extends LinkedList<T> {
  protected head: DoublyNode<T> | null = null;
  protected tail: DoublyNode<T> | null = null;

  append(element: T): void {
    const node = new DoublyNode(element);
    if (!this.head) this.head = node;
    else {
      this.tail!.next = node;
      node.prev = this.tail;
    }
    this.tail = node;

    this.length++;
  }

  prepend(element: T): void {
    if (!this.head) this.append(element);
    else {
      const node = new DoublyNode(element);
      node.next = this.head;
      this.head.prev = node;
      this.head = node;
      this.length++;
    }
  }

  insert(position: number, element: T): boolean {
    if (position < 0 || position > this.length) return false;

    if (position === 0) this.prepend(element);
    else if (position === this.length) this.append(element);
    else {
      const node = new DoublyNode(element);
      const current = this.getNode(position)! as DoublyNode<T>;
      node.prev = current.prev;
      current.prev!.next = node;
      node.next = current;
      current.prev = node;
      this.length++;
    }
    return true;
  }

  removeAt(position: number): T | null {
    if (position < 0 || position >= this.length) return null;

    const current = this.getNode(position)! as DoublyNode<T>;
    if (position === 0) {
      this.head = current.next;
      if (this.length !== 1) {
        this.head!.prev = null;
      }
    } else {
      current.prev!.next = current.next;
      if (position !== this.length - 1) {
        current.next!.prev = current.prev;
      }
    }
    if (this.isTail(current)) {
      this.tail = current.prev;
    }

    this.length--;
    
    return current.value;
  }

  postTraverse(): void {
    const values: T[] = [];
    let current: DoublyNode<T> | null = this.tail;
    while (current) {
      values.push(current.value);
      current = current.prev;
    }
    console.log(values.join('==>'));
  }
}

export default DoublyLinkedList;
