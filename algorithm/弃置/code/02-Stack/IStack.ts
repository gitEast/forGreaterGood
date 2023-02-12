interface IStack<T> {
  push: (element: T) => boolean;
  pop: () => T | null;
  peek: () => T | null;
  isEmpty: () => boolean;
  size: () => number;
}

export default IStack;
