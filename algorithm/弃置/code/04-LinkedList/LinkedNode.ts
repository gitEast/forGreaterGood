import INode from './ILinkedNode';

class LinkedNode<T> implements INode<T> {
  value: T;
  next: LinkedNode<T> | null = null;

  constructor(element: T) {
    this.value = element;
  }
}

export default LinkedNode;
