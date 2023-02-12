interface IQueue<T> {
  enqueue: (element: T) => boolean;
  dequeue: () => T | null;
  peek: () => T | null;
  isEmpty: () => boolean;
  size: () => number;
}

export default IQueue;
