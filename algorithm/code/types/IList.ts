interface IList<T> {
  peek(): T | null;
  isEmpty(): boolean;
  size(): number;
}

export default IList;
