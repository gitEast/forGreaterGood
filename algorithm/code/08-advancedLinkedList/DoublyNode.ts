import Node from './Node';

class DoublyNode<T> extends Node<T> {
  prev: DoublyNode<T> | null = null;
  next: DoublyNode<T> | null = null;
}

export default DoublyNode;
