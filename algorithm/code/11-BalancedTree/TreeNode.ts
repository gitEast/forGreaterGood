class TreeNode<T> {
  value: T;
  left: TreeNode<T> | null = null;
  right: TreeNode<T> | null = null;
  parent: TreeNode<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }

  get isLeft() {
    return this.parent?.left === this;
  }

  get isRight() {
    return this.parent?.right === this;
  }
}

export default TreeNode;
