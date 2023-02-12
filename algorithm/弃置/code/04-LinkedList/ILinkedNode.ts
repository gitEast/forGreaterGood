interface ILinkedNode<T> {
  value: T;
  next: ILinkedNode<T> | null;
}

export default ILinkedNode;
