import LinkedList from './LinkedList';

class CircularLinkedList<T> extends LinkedList<T> {
  append(element: T): void {
    super.append(element);
    this.tail!.next = this.head;
  }

  insert(position: number, element: T): boolean {
    if (position < 0 || position > this.length) return false;
    if (position === this.length) {
      this.append(element);
    } else {
      super.insert(position, element);
    }
    return true;
  }

  removeAt(position: number): T | null {
    const value = super.removeAt(position);
    if (this.tail) {
      this.tail.next = this.head;
    }

    return value;
  }
}

export default CircularLinkedList;
