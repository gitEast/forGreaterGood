import IQueue from "./IQueue";

class ArrayQueue<T> implements IQueue<T> {
  queue: T[] = [];

  enqueue(element: T): boolean {
    try {
      this.queue.push(element);
      return true;
    } catch (error) {
      return false;
    }
  }

  dequeue(): T | null {
    return this.queue.shift() ?? null;
  }

  peek(): T | null {
    return this.queue[0];
  }

  isEmpty(): boolean {
    return this.queue.length === 0;
  }

  size(): number {
    return this.queue.length;
  }
}

export default ArrayQueue;
