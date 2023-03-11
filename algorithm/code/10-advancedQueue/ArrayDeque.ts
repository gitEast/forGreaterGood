import { ArrayQueue } from '../03-Queue';

class ArrayDeque<T> extends ArrayQueue<T> {
  addFront(value: T) {
    this.data.unshift(value);
  }

  removeBack(): T | undefined {
    return this.data.pop();
  }
}

export default ArrayDeque;
