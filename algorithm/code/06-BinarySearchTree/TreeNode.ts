class Node<T> {
  value: T;

  constructor(value: T) {
    this.value = value;
  }
}

class TreeNode<T> extends Node<T> {
  left: TreeNode<T> | null = null;
  right: TreeNode<T> | null = null;
  parent: TreeNode<T> | null = null;

  get isLeft() {
    return this.parent?.left === this;
  }

  get isRight() {
    return this.parent?.right === this;
  }
}

export default TreeNode;
