import { IQueue } from '../types';
import { BinaryHeap } from '../09-Heap';

class PriorityQueue<T> implements IQueue<T> {
  private heap = new BinaryHeap<T>();

  enqueue(element: T): void {
    this.heap.insert(element);
  }

  dequeue(): T | undefined {
    return this.heap.extract() ?? undefined;
  }

  peek(): T | undefined {
    return this.heap.peek() ?? undefined;
  }

  isEmpty(): boolean {
    return this.heap.isEmpty();
  }

  size(): number {
    return this.heap.size();
  }
}

export default PriorityQueue;
