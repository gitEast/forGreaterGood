import IList from './IList';

interface ILinkedList<T> extends IList<T> {
  append(element: T): void;
  insert(position: number, element: T): boolean;
  get(position: number): T | null;
  indexOf(element: T): number;
  update(position: number, element: T): boolean;
  removeAt(position: number): T | null;
  remove(element: T): boolean;
}

export default ILinkedList;
