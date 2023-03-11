import IList from '../types/IList';

interface IHeap<T> extends IList<T> {
  insert(value: T): void;
  extract(): T | null;
  buildHeap(arr: T[]): void;
}

export default IHeap;
