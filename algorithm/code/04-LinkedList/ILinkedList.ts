interface ILinkedList<T> {
  append(element: T): void;
  insert(position: number, element: T): boolean;
  removeAt(position: number): T | null;
  get(position: number): T | null;
  update(position: number, element: T): boolean;
  indexOf(element: T): number;
  remove(element: T): T | null;
  isEmpty(): boolean;
  size(): number;
}

export default ILinkedList;
