export interface INode<T> {
  value: T;
  next: INode<T> | null;
}

export interface ILinkedList<T> {
  append(element: T): boolean;
  insert(position: number, element: T): boolean;
  get(position: number): INode<T> | null;
  indexOf(element: T): number;
  update(position: number, element: T): boolean;
  removeAt(position: number): INode<T> | null;
  remove(element: T): INode<T> | null;
  isEmpty(): boolean;
  size(): number;
}
