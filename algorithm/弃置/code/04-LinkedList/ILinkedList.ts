import ILinkedNode from "./ILinkedNode";

interface ILinkedList<T> {
  append: (element: T) => boolean;
  insert: (position: number, element: T) => boolean;
  get: (position: number) => ILinkedNode<T> | null;
  indexOf: (element: T) => number;
  update: (position: number, element: T) => boolean;
  removeAt: (position: number) => ILinkedNode<T> | null;
  remove: (element: T) => ILinkedNode<T> | null;
  isEmpty: () => boolean;
  size: () => number;
}

export default ILinkedList;
